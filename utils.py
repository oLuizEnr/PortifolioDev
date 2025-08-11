import os
import secrets
import uuid
from PIL import Image
from flask import current_app, url_for
from flask_mail import Message
from app import mail
import re
from urllib.parse import quote

def save_picture(form_picture, folder='uploads', size=(800, 600)):
    """Save uploaded picture with unique filename and resize if needed"""
    random_hex = secrets.token_hex(8)
    _, f_ext = os.path.splitext(form_picture.filename)
    picture_fn = random_hex + f_ext
    picture_path = os.path.join(current_app.root_path, 'static', folder, picture_fn)
    
    # Create directory if it doesn't exist
    os.makedirs(os.path.dirname(picture_path), exist_ok=True)
    
    # Resize and save image
    img = Image.open(form_picture)
    img.thumbnail(size, Image.Resampling.LANCZOS)
    img.save(picture_path, optimize=True, quality=85)
    
    return picture_fn

def delete_picture(filename, folder='uploads'):
    """Delete picture file from uploads folder"""
    if filename:
        file_path = os.path.join(current_app.root_path, 'static', folder, filename)
        if os.path.exists(file_path):
            os.remove(file_path)

def create_slug(text):
    """Create URL-friendly slug from text"""
    # Remove special characters and convert to lowercase
    slug = re.sub(r'[^\w\s-]', '', text.lower())
    # Replace spaces and multiple hyphens with single hyphen
    slug = re.sub(r'[-\s]+', '-', slug)
    # Remove leading/trailing hyphens
    slug = slug.strip('-')
    return slug

def make_unique_slug(model_class, slug_field, slug_value, exclude_id=None):
    """Ensure slug is unique by appending number if necessary"""
    original_slug = slug_value
    counter = 1
    
    while True:
        query = model_class.query.filter(getattr(model_class, slug_field) == slug_value)
        if exclude_id:
            query = query.filter(model_class.id != exclude_id)
        
        if not query.first():
            return slug_value
        
        slug_value = f"{original_slug}-{counter}"
        counter += 1

def send_email(subject, sender, recipients, text_body, html_body):
    """Send email using Flask-Mail"""
    try:
        msg = Message(subject, sender=sender, recipients=recipients)
        msg.body = text_body
        msg.html = html_body
        mail.send(msg)
        return True
    except Exception as e:
        current_app.logger.error(f"Email sending failed: {str(e)}")
        return False

def send_comment_notification(project, comment, user):
    """Send notification email when new comment is posted"""
    from models import SiteSettings
    
    settings = SiteSettings.query.first()
    if not settings or not settings.owner_email:
        return False
    
    subject = f"Novo comentário no projeto: {project.title}"
    
    text_body = f"""
    Olá!
    
    Um novo comentário foi postado no seu projeto "{project.title}".
    
    Comentário de: {user.full_name} ({user.email})
    Comentário: {comment.content}
    
    Visualizar projeto: {url_for('main.project_detail', slug=project.slug, _external=True)}
    
    Atenciosamente,
    Sistema de Portfólio
    """
    
    html_body = f"""
    <h2>Novo comentário no projeto: {project.title}</h2>
    <p>Um novo comentário foi postado no seu projeto.</p>
    
    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Comentário de:</strong> {user.full_name} ({user.email})</p>
        <p><strong>Comentário:</strong></p>
        <blockquote>{comment.content}</blockquote>
    </div>
    
    <p><a href="{url_for('main.project_detail', slug=project.slug, _external=True)}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Visualizar projeto</a></p>
    
    <p>Atenciosamente,<br>Sistema de Portfólio</p>
    """
    
    return send_email(subject, current_app.config['MAIL_DEFAULT_SENDER'], [settings.owner_email], text_body, html_body)

def send_password_reset_email(user, token):
    """Send password reset email"""
    subject = "Redefinição de senha - Portfólio"
    
    text_body = f"""
    Olá {user.full_name},
    
    Você solicitou a redefinição da sua senha.
    
    Clique no link abaixo para redefinir sua senha:
    {url_for('auth.reset_password', token=token, _external=True)}
    
    Se você não solicitou esta redefinição, ignore este email.
    
    Atenciosamente,
    Sistema de Portfólio
    """
    
    html_body = f"""
    <h2>Redefinição de senha</h2>
    <p>Olá {user.full_name},</p>
    
    <p>Você solicitou a redefinição da sua senha.</p>
    
    <p><a href="{url_for('auth.reset_password', token=token, _external=True)}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Redefinir senha</a></p>
    
    <p>Se você não solicitou esta redefinição, ignore este email.</p>
    
    <p>Atenciosamente,<br>Sistema de Portfólio</p>
    """
    
    return send_email(subject, current_app.config['MAIL_DEFAULT_SENDER'], [user.email], text_body, html_body)

def generate_reset_token():
    """Generate secure reset token"""
    return secrets.token_urlsafe(32)

def create_linkedin_share_url(project):
    """Create LinkedIn share URL for project"""
    project_url = url_for('main.project_detail', slug=project.slug, _external=True)
    title = project.title
    summary = project.description[:200] + '...' if len(project.description) > 200 else project.description
    
    linkedin_url = "https://www.linkedin.com/sharing/share-offsite/"
    params = f"url={quote(project_url)}"
    
    return f"{linkedin_url}?{params}"

def increment_view_count(project):
    """Increment project view count"""
    from app import db
    project.views_count = (project.views_count or 0) + 1
    db.session.commit()

def get_or_create_tag(tag_name):
    """Get existing tag or create new one"""
    from models import Tag
    from app import db
    
    tag_name = tag_name.strip().lower()
    slug = create_slug(tag_name)
    
    tag = Tag.query.filter_by(slug=slug).first()
    if not tag:
        tag = Tag(name=tag_name, slug=slug)
        db.session.add(tag)
        db.session.commit()
    
    return tag

def process_tags(tags_string):
    """Process comma-separated tags string into Tag objects"""
    if not tags_string:
        return []
    
    tag_names = [tag.strip() for tag in tags_string.split(',') if tag.strip()]
    tags = []
    
    for tag_name in tag_names:
        tag = get_or_create_tag(tag_name)
        tags.append(tag)
    
    return tags

def get_site_settings():
    """Get site settings, create default if doesn't exist"""
    from models import SiteSettings
    from app import db
    
    settings = SiteSettings.query.first()
    if not settings:
        settings = SiteSettings()
        db.session.add(settings)
        db.session.commit()
    
    return settings
