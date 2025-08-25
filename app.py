from flask import Flask, request, jsonify, session, send_from_directory
from flask_cors import CORS
from flask_session import Session
from werkzeug.utils import secure_filename
from models import db, User, Project, Experience, Achievement, Like, Comment, File
from datetime import datetime, timedelta
import os
import uuid
from typing import Optional, List
import json

app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-here')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///portfolio.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_FILE_DIR'] = './sessions'
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_USE_SIGNER'] = True
app.config['SESSION_KEY_PREFIX'] = 'portfolio:'
app.config['UPLOAD_FOLDER'] = 'static'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Initialize extensions
db.init_app(app)
Session(app)
CORS(app, supports_credentials=True)

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

with app.app_context():
    db.create_all()

# Auth decorator
def login_required(f):
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'message': 'Unauthorized'}), 401
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

def admin_required(f):
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'message': 'Unauthorized'}), 401
        
        user = User.query.get(session['user_id'])
        if not user or not user.is_admin:
            return jsonify({'message': 'Admin access required'}), 403
        
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

# Helper functions
def user_to_dict(user: User, exclude_password=True):
    data = {
        'id': user.id,
        'email': user.email,
        'firstName': user.first_name,
        'lastName': user.last_name,
        'profileImageUrl': user.profile_image_url,
        'heroImageUrl': user.hero_image_url,
        'linkedinUrl': user.linkedin_url,
        'githubUrl': user.github_url,
        'isAdmin': user.is_admin,
        'createdAt': user.created_at.isoformat() if user.created_at else None,
        'updatedAt': user.updated_at.isoformat() if user.updated_at else None
    }
    if not exclude_password:
        data['password'] = user.password
    return data

def project_to_dict(project: Project):
    return {
        'id': project.id,
        'title': project.title,
        'description': project.description,
        'imageUrl': project.image_url,
        'githubUrl': project.github_url,
        'liveUrl': project.live_url,
        'technologies': project.technologies or [],
        'featured': project.featured,
        'published': project.published,
        'linkedinPost': project.linkedin_post,
        'linkedinPostUrl': project.linkedin_post_url,
        'additionalImages': project.additional_images or [],
        'createdAt': project.created_at.isoformat() if project.created_at else None,
        'updatedAt': project.updated_at.isoformat() if project.updated_at else None
    }

def experience_to_dict(experience: Experience):
    return {
        'id': experience.id,
        'position': experience.position,
        'company': experience.company,
        'startDate': experience.start_date.isoformat() if experience.start_date else None,
        'endDate': experience.end_date.isoformat() if experience.end_date else None,
        'description': experience.description,
        'technologies': experience.technologies or [],
        'published': experience.published,
        'linkedinPost': experience.linkedin_post,
        'linkedinPostUrl': experience.linkedin_post_url,
        'companyLogoUrl': experience.company_logo_url,
        'additionalImages': experience.additional_images or [],
        'createdAt': experience.created_at.isoformat() if experience.created_at else None,
        'updatedAt': experience.updated_at.isoformat() if experience.updated_at else None
    }

def achievement_to_dict(achievement: Achievement):
    return {
        'id': achievement.id,
        'title': achievement.title,
        'description': achievement.description,
        'date': achievement.date.isoformat() if achievement.date else None,
        'type': achievement.type,
        'certificateUrl': achievement.certificate_url,
        'published': achievement.published,
        'linkedinPost': achievement.linkedin_post,
        'linkedinPostUrl': achievement.linkedin_post_url,
        'badgeImageUrl': achievement.badge_image_url,
        'additionalImages': achievement.additional_images or [],
        'createdAt': achievement.created_at.isoformat() if achievement.created_at else None,
        'updatedAt': achievement.updated_at.isoformat() if achievement.updated_at else None
    }

def comment_to_dict(comment: Comment):
    return {
        'id': comment.id,
        'userId': comment.user_id,
        'authorName': comment.author_name,
        'authorEmail': comment.author_email,
        'itemType': comment.item_type,
        'itemId': comment.item_id,
        'content': comment.content,
        'parentId': comment.parent_id,
        'createdAt': comment.created_at.isoformat() if comment.created_at else None,
        'updatedAt': comment.updated_at.isoformat() if comment.updated_at else None
    }

# Auth routes
@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        user = User.query.filter_by(email=email).first()
        if not user or user.password != password:
            return jsonify({'message': 'Invalid credentials'}), 401
        
        session['user_id'] = user.id
        return jsonify({
            'message': 'Login successful',
            'user': user_to_dict(user)
        })
    
    except Exception as e:
        return jsonify({'message': 'Login failed'}), 500

@app.route('/api/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({'message': 'Logout successful'})

@app.route('/api/auth/user', methods=['GET'])
@login_required
def get_current_user():
    try:
        user = User.query.get(session['user_id'])
        if not user:
            return jsonify({'message': 'User not found'}), 404
        return jsonify(user_to_dict(user))
    except Exception as e:
        return jsonify({'message': 'Failed to fetch user'}), 500

# Public routes
@app.route('/api/profile', methods=['GET'])
def get_profile():
    try:
        admin = User.query.filter_by(is_admin=True).first()
        if not admin:
            return jsonify({'message': 'Admin profile not found'}), 404
        
        return jsonify({
            'firstName': admin.first_name,
            'lastName': admin.last_name,
            'profileImageUrl': admin.profile_image_url,
            'heroImageUrl': admin.hero_image_url or 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            'linkedinUrl': admin.linkedin_url,
            'githubUrl': admin.github_url
        })
    except Exception as e:
        return jsonify({'message': 'Failed to fetch profile'}), 500

# Projects routes
@app.route('/api/projects', methods=['GET'])
def get_projects():
    try:
        projects = Project.query.filter_by(published=True).all()
        return jsonify([project_to_dict(p) for p in projects])
    except Exception as e:
        return jsonify({'message': 'Failed to fetch projects'}), 500

@app.route('/api/projects/featured', methods=['GET'])
def get_featured_projects():
    try:
        projects = Project.query.filter_by(published=True, featured=True).all()
        return jsonify([project_to_dict(p) for p in projects])
    except Exception as e:
        return jsonify({'message': 'Failed to fetch featured projects'}), 500

@app.route('/api/projects/<project_id>', methods=['GET'])
def get_project(project_id):
    try:
        project = Project.query.get(project_id)
        if not project:
            return jsonify({'message': 'Project not found'}), 404
        
        return jsonify(project_to_dict(project))
    except Exception as e:
        return jsonify({'message': 'Failed to fetch project'}), 500

# Experiences routes
@app.route('/api/experiences', methods=['GET'])
def get_experiences():
    try:
        experiences = Experience.query.filter_by(published=True).all()
        return jsonify([experience_to_dict(e) for e in experiences])
    except Exception as e:
        return jsonify({'message': 'Failed to fetch experiences'}), 500

# Achievements routes
@app.route('/api/achievements', methods=['GET'])
def get_achievements():
    try:
        achievements = Achievement.query.filter_by(published=True).all()
        return jsonify([achievement_to_dict(a) for a in achievements])
    except Exception as e:
        return jsonify({'message': 'Failed to fetch achievements'}), 500

# Contact form
@app.route('/api/contact', methods=['POST'])
def contact():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        subject = data.get('subject')
        message = data.get('message')
        
        if not all([name, email, subject, message]):
            return jsonify({'message': 'All fields are required'}), 400
        
        # Log the contact form submission
        print(f"Contact form submission: {name} ({email}) - {subject}: {message}")
        
        return jsonify({'message': 'Message sent successfully'})
    except Exception as e:
        return jsonify({'message': 'Failed to send message'}), 500

# Import and register admin routes
from admin_routes import admin_routes
admin_routes(app)

# File upload routes
from upload_service import UploadService

@app.route('/api/upload', methods=['POST'])
@login_required
@admin_required
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({'message': 'No file part'}), 400
        
        file = request.files['file']
        user_id = session['user_id']
        
        file_info = UploadService.save_file(file, user_id)
        return jsonify(file_info)
        
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        return jsonify({'message': 'Failed to upload file'}), 500

@app.route('/api/files/<file_id>', methods=['DELETE'])
@login_required
@admin_required
def delete_file(file_id):
    try:
        success = UploadService.delete_file(file_id)
        if success:
            return jsonify({'message': 'File deleted successfully'})
        else:
            return jsonify({'message': 'File not found'}), 404
    except Exception as e:
        return jsonify({'message': 'Failed to delete file'}), 500

@app.route('/api/files/<file_id>', methods=['GET'])
def get_file_info(file_id):
    try:
        file_info = UploadService.get_file_info(file_id)
        if file_info:
            return jsonify(file_info)
        else:
            return jsonify({'message': 'File not found'}), 404
    except Exception as e:
        return jsonify({'message': 'Failed to get file info'}), 500

# Serve uploaded files
@app.route('/static/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Serve React frontend (for production)
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    # Serve static files from dist/public
    if path and os.path.exists(os.path.join("dist/public", path)):
        return send_from_directory("dist/public", path)
    else:
        return send_from_directory("dist/public", "index.html")

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        
        # Create default admin user if none exists
        admin = User.query.filter_by(is_admin=True).first()
        if not admin:
            admin = User()
            admin.email = 'admin@example.com'
            admin.password = 'admin123'  # Change this in production
            admin.first_name = 'Admin'
            admin.last_name = 'User'
            admin.is_admin = True
            db.session.add(admin)
            db.session.commit()
            print("Created default admin user: admin@example.com / admin123")
    
    app.run(host='0.0.0.0', port=5000, debug=True)