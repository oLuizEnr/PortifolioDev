import os
from datetime import datetime, timezone, timedelta
from flask import render_template, url_for, flash, redirect, request, abort, jsonify, current_app, send_from_directory
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.utils import secure_filename
from sqlalchemy import or_, desc, func
from app import app, db
from models import User, Project, Achievement, Comment, Like, Category, Tag, SiteSettings, ProjectImage
from forms import (LoginForm, RegisterForm, ForgotPasswordForm, ResetPasswordForm, 
                  ProfileForm, ProjectForm, AchievementForm, CommentForm, CategoryForm, SiteSettingsForm)
from utils import (save_picture, delete_picture, create_slug, make_unique_slug, 
                  send_comment_notification, send_password_reset_email, generate_reset_token,
                  create_linkedin_share_url, increment_view_count, process_tags, get_site_settings)

# Main routes
@app.route('/')
def index():
    """Homepage with featured projects and achievements"""
    settings = get_site_settings()
    
    # Get featured projects
    featured_projects = Project.query.filter_by(status='published', is_featured=True).limit(3).all()
    
    # Get recent projects if no featured projects
    if not featured_projects:
        featured_projects = Project.query.filter_by(status='published').order_by(desc(Project.created_at)).limit(3).all()
    
    # Get featured achievements
    featured_achievements = Achievement.query.filter_by(status='published', is_featured=True).limit(3).all()
    
    # Get recent achievements if no featured achievements
    if not featured_achievements:
        featured_achievements = Achievement.query.filter_by(status='published').order_by(desc(Achievement.created_at)).limit(3).all()
    
    return render_template('index.html', 
                         featured_projects=featured_projects,
                         featured_achievements=featured_achievements,
                         settings=settings)

@app.route('/portfolio')
def portfolio():
    """Portfolio page with all published projects"""
    page = request.args.get('page', 1, type=int)
    category_id = request.args.get('category', type=int)
    tag_slug = request.args.get('tag')
    search = request.args.get('search', '')
    
    # Base query
    query = Project.query.filter_by(status='published')
    
    # Filter by category
    if category_id:
        query = query.filter_by(category_id=category_id)
    
    # Filter by tag
    if tag_slug:
        tag = Tag.query.filter_by(slug=tag_slug).first()
        if tag:
            query = query.filter(Project.tags.contains(tag))
    
    # Search filter
    if search:
        query = query.filter(or_(
            Project.title.contains(search),
            Project.description.contains(search),
            Project.technologies.contains(search)
        ))
    
    # Pagination
    projects = query.order_by(desc(Project.created_at)).paginate(
        page=page, per_page=current_app.config.get('PROJECTS_PER_PAGE', 9), error_out=False)
    
    # Get categories and tags for filters
    categories = Category.query.all()
    tags = Tag.query.all()
    
    return render_template('portfolio.html', 
                         projects=projects, 
                         categories=categories, 
                         tags=tags,
                         current_category=category_id,
                         current_tag=tag_slug,
                         search=search)

@app.route('/projeto/<slug>')
def project_detail(slug):
    """Individual project detail page"""
    project = Project.query.filter_by(slug=slug, status='published').first_or_404()
    
    # Increment view count
    increment_view_count(project)
    
    # Get comments
    comments = Comment.query.filter_by(project_id=project.id, is_approved=True).order_by(desc(Comment.created_at)).all()
    
    # Check if current user liked this project
    user_liked = False
    if current_user.is_authenticated:
        user_liked = Like.query.filter_by(user_id=current_user.id, project_id=project.id).first() is not None
    
    # Related projects (same category, excluding current)
    related_projects = Project.query.filter(
        Project.category_id == project.category_id,
        Project.id != project.id,
        Project.status == 'published'
    ).limit(3).all()
    
    # Comment form
    comment_form = CommentForm()
    
    # LinkedIn share URL
    linkedin_share_url = create_linkedin_share_url(project)
    
    return render_template('project_detail.html', 
                         project=project, 
                         comments=comments,
                         comment_form=comment_form,
                         user_liked=user_liked,
                         related_projects=related_projects,
                         linkedin_share_url=linkedin_share_url)

@app.route('/sobre')
def about():
    """About page"""
    settings = get_site_settings()
    return render_template('about.html', settings=settings)

# Authentication routes
@app.route('/login', methods=['GET', 'POST'])
def login():
    """User login"""
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    
    form = LoginForm()
    if form.validate_on_submit():
        # Try to find user by username or email
        user = User.query.filter(
            or_(User.username == form.username.data, 
                User.email == form.username.data)
        ).first()
        
        if user and user.check_password(form.password.data) and user.is_active:
            login_user(user, remember=form.remember_me.data)
            next_page = request.args.get('next')
            if not next_page or not next_page.startswith('/'):
                next_page = url_for('index')
            flash('Login realizado com sucesso!', 'success')
            return redirect(next_page)
        else:
            flash('Nome de usuário/email ou senha inválidos.', 'error')
    
    return render_template('auth/login.html', form=form)

@app.route('/register', methods=['GET', 'POST'])
def register():
    """User registration"""
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    
    form = RegisterForm()
    if form.validate_on_submit():
        user = User(
            username=form.username.data,
            email=form.email.data,
            first_name=form.first_name.data,
            last_name=form.last_name.data
        )
        user.set_password(form.password.data)
        
        db.session.add(user)
        db.session.commit()
        
        flash('Cadastro realizado com sucesso! Você pode fazer login agora.', 'success')
        return redirect(url_for('login'))
    
    return render_template('auth/register.html', form=form)

@app.route('/logout')
@login_required
def logout():
    """User logout"""
    logout_user()
    flash('Logout realizado com sucesso!', 'info')
    return redirect(url_for('index'))

@app.route('/forgot-password', methods=['GET', 'POST'])
def forgot_password():
    """Forgot password"""
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    
    form = ForgotPasswordForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user:
            token = generate_reset_token()
            user.reset_token = token
            user.reset_token_expires = datetime.now(timezone.utc) + timedelta(hours=1)
            db.session.commit()
            
            if send_password_reset_email(user, token):
                flash('Um email com instruções para redefinir sua senha foi enviado.', 'info')
            else:
                flash('Erro ao enviar email. Tente novamente mais tarde.', 'error')
        else:
            flash('Email não encontrado.', 'error')
    
    return render_template('auth/forgot_password.html', form=form)

@app.route('/reset-password/<token>', methods=['GET', 'POST'])
def reset_password(token):
    """Reset password with token"""
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    
    user = User.query.filter_by(reset_token=token).first()
    if not user or user.reset_token_expires < datetime.now(timezone.utc):
        flash('Token inválido ou expirado.', 'error')
        return redirect(url_for('forgot_password'))
    
    form = ResetPasswordForm()
    if form.validate_on_submit():
        user.set_password(form.password.data)
        user.reset_token = None
        user.reset_token_expires = None
        db.session.commit()
        
        flash('Sua senha foi redefinida com sucesso!', 'success')
        return redirect(url_for('login'))
    
    return render_template('auth/reset_password.html', form=form)

# User profile routes
@app.route('/profile')
@login_required
def profile():
    """User profile page"""
    return render_template('profile.html')

@app.route('/edit-profile', methods=['GET', 'POST'])
@login_required
def edit_profile():
    """Edit user profile"""
    form = ProfileForm()
    
    if form.validate_on_submit():
        current_user.first_name = form.first_name.data
        current_user.last_name = form.last_name.data
        current_user.bio = form.bio.data
        
        if form.profile_image.data:
            # Delete old image
            if current_user.profile_image:
                delete_picture(current_user.profile_image)
            
            # Save new image
            picture_file = save_picture(form.profile_image.data, size=(300, 300))
            current_user.profile_image = picture_file
        
        db.session.commit()
        flash('Perfil atualizado com sucesso!', 'success')
        return redirect(url_for('profile'))
    
    elif request.method == 'GET':
        form.first_name.data = current_user.first_name
        form.last_name.data = current_user.last_name
        form.bio.data = current_user.bio
    
    return render_template('edit_profile.html', form=form)

# Comment and like routes
@app.route('/project/<slug>/comment', methods=['POST'])
@login_required
def add_comment(slug):
    """Add comment to project"""
    project = Project.query.filter_by(slug=slug, status='published').first_or_404()
    form = CommentForm()
    
    if form.validate_on_submit():
        comment = Comment(
            content=form.content.data,
            user_id=current_user.id,
            project_id=project.id
        )
        
        db.session.add(comment)
        
        # Update comment count
        project.comments_count = (project.comments_count or 0) + 1
        db.session.commit()
        
        # Send notification email
        send_comment_notification(project, comment, current_user)
        
        flash('Comentário adicionado com sucesso!', 'success')
    else:
        flash('Erro ao adicionar comentário.', 'error')
    
    return redirect(url_for('project_detail', slug=slug))

@app.route('/project/<slug>/like', methods=['POST'])
@login_required
def toggle_like(slug):
    """Toggle like on project"""
    project = Project.query.filter_by(slug=slug, status='published').first_or_404()
    
    existing_like = Like.query.filter_by(user_id=current_user.id, project_id=project.id).first()
    
    if existing_like:
        # Unlike
        db.session.delete(existing_like)
        project.likes_count = max(0, (project.likes_count or 0) - 1)
        liked = False
    else:
        # Like
        like = Like(user_id=current_user.id, project_id=project.id)
        db.session.add(like)
        project.likes_count = (project.likes_count or 0) + 1
        liked = True
    
    db.session.commit()
    
    return jsonify({
        'liked': liked,
        'likes_count': project.likes_count
    })

# Admin routes (only for portfolio owner)
@app.route('/admin')
@login_required
def admin_dashboard():
    """Admin dashboard"""
    if not current_user.is_owner:
        abort(403)
    
    # Statistics
    total_projects = Project.query.count()
    published_projects = Project.query.filter_by(status='published').count()
    total_achievements = Achievement.query.count()
    total_comments = Comment.query.count()
    total_likes = Like.query.count()
    
    # Recent activities
    recent_projects = Project.query.order_by(desc(Project.created_at)).limit(5).all()
    recent_comments = Comment.query.order_by(desc(Comment.created_at)).limit(5).all()
    
    return render_template('admin/dashboard.html',
                         total_projects=total_projects,
                         published_projects=published_projects,
                         total_achievements=total_achievements,
                         total_comments=total_comments,
                         total_likes=total_likes,
                         recent_projects=recent_projects,
                         recent_comments=recent_comments)

@app.route('/admin/projects')
@login_required
def admin_projects():
    """Admin projects list"""
    if not current_user.is_owner:
        abort(403)
    
    page = request.args.get('page', 1, type=int)
    projects = Project.query.order_by(desc(Project.created_at)).paginate(
        page=page, per_page=10, error_out=False)
    
    return render_template('admin/projects_list.html', projects=projects)

@app.route('/admin/project/new', methods=['GET', 'POST'])
@login_required
def admin_project_new():
    """Create new project"""
    if not current_user.is_owner:
        abort(403)
    
    form = ProjectForm()
    
    if form.validate_on_submit():
        # Create slug
        slug = create_slug(form.title.data)
        slug = make_unique_slug(Project, 'slug', slug)
        
        project = Project(
            title=form.title.data,
            slug=slug,
            description=form.description.data,
            content=form.content.data,
            category_id=form.category_id.data if form.category_id.data > 0 else None,
            demo_url=form.demo_url.data,
            github_url=form.github_url.data,
            technologies=form.technologies.data,
            completion_date=form.completion_date.data,
            status=form.status.data,
            is_featured=form.is_featured.data,
            meta_title=form.meta_title.data,
            meta_description=form.meta_description.data
        )
        
        # Handle featured image
        if form.featured_image.data:
            picture_file = save_picture(form.featured_image.data)
            project.featured_image = picture_file
        
        # Set published date if publishing
        if form.status.data == 'published':
            project.published_at = datetime.now(timezone.utc)
        
        db.session.add(project)
        db.session.flush()  # To get the project ID
        
        # Process tags
        if form.tags.data:
            tags = process_tags(form.tags.data)
            project.tags.extend(tags)
        
        db.session.commit()
        
        flash('Projeto criado com sucesso!', 'success')
        return redirect(url_for('admin_projects'))
    
    return render_template('admin/project_form.html', form=form, title='Novo Projeto')

@app.route('/admin/project/<int:id>/edit', methods=['GET', 'POST'])
@login_required
def admin_project_edit(id):
    """Edit project"""
    if not current_user.is_owner:
        abort(403)
    
    project = Project.query.get_or_404(id)
    form = ProjectForm()
    
    if form.validate_on_submit():
        # Update slug if title changed
        if project.title != form.title.data:
            slug = create_slug(form.title.data)
            slug = make_unique_slug(Project, 'slug', slug, exclude_id=project.id)
            project.slug = slug
        
        project.title = form.title.data
        project.description = form.description.data
        project.content = form.content.data
        project.category_id = form.category_id.data if form.category_id.data > 0 else None
        project.demo_url = form.demo_url.data
        project.github_url = form.github_url.data
        project.technologies = form.technologies.data
        project.completion_date = form.completion_date.data
        project.is_featured = form.is_featured.data
        project.meta_title = form.meta_title.data
        project.meta_description = form.meta_description.data
        
        # Handle status change
        old_status = project.status
        project.status = form.status.data
        
        if old_status != 'published' and form.status.data == 'published':
            project.published_at = datetime.now(timezone.utc)
        
        # Handle featured image
        if form.featured_image.data:
            # Delete old image
            if project.featured_image:
                delete_picture(project.featured_image)
            
            picture_file = save_picture(form.featured_image.data)
            project.featured_image = picture_file
        
        # Process tags
        project.tags.clear()
        if form.tags.data:
            tags = process_tags(form.tags.data)
            project.tags.extend(tags)
        
        db.session.commit()
        
        flash('Projeto atualizado com sucesso!', 'success')
        return redirect(url_for('admin_projects'))
    
    elif request.method == 'GET':
        form.title.data = project.title
        form.description.data = project.description
        form.content.data = project.content
        form.category_id.data = project.category_id or 0
        form.tags.data = ', '.join([tag.name for tag in project.tags])
        form.demo_url.data = project.demo_url
        form.github_url.data = project.github_url
        form.technologies.data = project.technologies
        form.completion_date.data = project.completion_date
        form.status.data = project.status
        form.is_featured.data = project.is_featured
        form.meta_title.data = project.meta_title
        form.meta_description.data = project.meta_description
    
    return render_template('admin/project_form.html', form=form, project=project, title='Editar Projeto')

@app.route('/admin/project/<int:id>/delete', methods=['POST'])
@login_required
def admin_project_delete(id):
    """Delete project"""
    if not current_user.is_owner:
        abort(403)
    
    project = Project.query.get_or_404(id)
    
    # Delete featured image
    if project.featured_image:
        delete_picture(project.featured_image)
    
    # Delete project images
    for image in project.images:
        delete_picture(image.filename)
    
    db.session.delete(project)
    db.session.commit()
    
    flash('Projeto excluído com sucesso!', 'success')
    return redirect(url_for('admin_projects'))

# Categories management
@app.route('/admin/categories')
@login_required
def admin_categories():
    """Admin categories list"""
    if not current_user.is_owner:
        abort(403)
    
    categories = Category.query.all()
    return render_template('admin/categories.html', categories=categories)

@app.route('/admin/category/new', methods=['GET', 'POST'])
@login_required
def admin_category_new():
    """Create new category"""
    if not current_user.is_owner:
        abort(403)
    
    form = CategoryForm()
    
    if form.validate_on_submit():
        slug = create_slug(form.name.data)
        slug = make_unique_slug(Category, 'slug', slug)
        
        category = Category(
            name=form.name.data,
            description=form.description.data,
            slug=slug
        )
        
        db.session.add(category)
        db.session.commit()
        
        flash('Categoria criada com sucesso!', 'success')
        return redirect(url_for('admin_categories'))
    
    return render_template('admin/category_form.html', form=form, title='Nova Categoria')

# Site settings
@app.route('/admin/settings', methods=['GET', 'POST'])
@login_required
def admin_settings():
    """Site settings"""
    if not current_user.is_owner:
        abort(403)
    
    settings = get_site_settings()
    form = SiteSettingsForm()
    
    if form.validate_on_submit():
        settings.site_title = form.site_title.data
        settings.site_description = form.site_description.data
        settings.owner_name = form.owner_name.data
        settings.owner_title = form.owner_title.data
        settings.owner_bio = form.owner_bio.data
        settings.owner_email = form.owner_email.data
        settings.owner_phone = form.owner_phone.data
        settings.owner_location = form.owner_location.data
        settings.linkedin_url = form.linkedin_url.data
        settings.github_url = form.github_url.data
        settings.twitter_url = form.twitter_url.data
        settings.instagram_url = form.instagram_url.data
        settings.meta_keywords = form.meta_keywords.data
        settings.google_analytics_id = form.google_analytics_id.data
        
        # Handle avatar upload
        if form.owner_avatar.data:
            if settings.owner_avatar:
                delete_picture(settings.owner_avatar)
            
            picture_file = save_picture(form.owner_avatar.data, size=(400, 400))
            settings.owner_avatar = picture_file
        
        db.session.commit()
        
        flash('Configurações atualizadas com sucesso!', 'success')
        return redirect(url_for('admin_settings'))
    
    elif request.method == 'GET':
        form.site_title.data = settings.site_title
        form.site_description.data = settings.site_description
        form.owner_name.data = settings.owner_name
        form.owner_title.data = settings.owner_title
        form.owner_bio.data = settings.owner_bio
        form.owner_email.data = settings.owner_email
        form.owner_phone.data = settings.owner_phone
        form.owner_location.data = settings.owner_location
        form.linkedin_url.data = settings.linkedin_url
        form.github_url.data = settings.github_url
        form.twitter_url.data = settings.twitter_url
        form.instagram_url.data = settings.instagram_url
        form.meta_keywords.data = settings.meta_keywords
        form.google_analytics_id.data = settings.google_analytics_id
    
    return render_template('admin/settings.html', form=form, settings=settings)

# Error handlers
@app.errorhandler(404)
def not_found_error(error):
    return render_template('errors/404.html'), 404

@app.errorhandler(403)
def forbidden_error(error):
    return render_template('errors/403.html'), 403

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return render_template('errors/500.html'), 500

# Context processors
@app.context_processor
def inject_site_settings():
    """Inject site settings into all templates"""
    return dict(site_settings=get_site_settings())

@app.context_processor
def inject_categories():
    """Inject categories into all templates"""
    return dict(all_categories=Category.query.all())

# Static file serving for uploads
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
