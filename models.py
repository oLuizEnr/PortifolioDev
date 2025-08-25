from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import uuid
from typing import List, Optional

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    profile_image_url = db.Column(db.String(500))
    hero_image_url = db.Column(db.String(500))
    linkedin_url = db.Column(db.String(500))
    github_url = db.Column(db.String(500))
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    likes = db.relationship('Like', backref='user', lazy=True, cascade='all, delete-orphan')
    comments = db.relationship('Comment', backref='user', lazy=True, cascade='all, delete-orphan')
    files = db.relationship('File', backref='user', lazy=True, cascade='all, delete-orphan')


class Project(db.Model):
    __tablename__ = 'projects'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(500))
    github_url = db.Column(db.String(500))
    live_url = db.Column(db.String(500))
    technologies = db.Column(db.JSON)
    featured = db.Column(db.Boolean, default=False)
    published = db.Column(db.Boolean, default=False)
    linkedin_post = db.Column(db.Text)
    linkedin_post_url = db.Column(db.String(500))  # URL do post no LinkedIn
    additional_images = db.Column(db.JSON)  # Array de URLs de imagens adicionais
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Experience(db.Model):
    __tablename__ = 'experiences'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    position = db.Column(db.String(200), nullable=False)
    company = db.Column(db.String(200), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime)
    description = db.Column(db.Text, nullable=False)
    technologies = db.Column(db.JSON)
    published = db.Column(db.Boolean, default=False)
    linkedin_post = db.Column(db.Text)
    linkedin_post_url = db.Column(db.String(500))  # URL do post no LinkedIn
    company_logo_url = db.Column(db.String(500))  # Logo da empresa
    additional_images = db.Column(db.JSON)  # Array de URLs de imagens adicionais
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Achievement(db.Model):
    __tablename__ = 'achievements'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    type = db.Column(db.String(50), nullable=False)  # certification, award, speaking, etc
    certificate_url = db.Column(db.String(500))
    published = db.Column(db.Boolean, default=False)
    linkedin_post = db.Column(db.Text)
    linkedin_post_url = db.Column(db.String(500))  # URL do post no LinkedIn
    badge_image_url = db.Column(db.String(500))  # Imagem do badge/certificado
    additional_images = db.Column(db.JSON)  # Array de URLs de imagens adicionais
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Like(db.Model):
    __tablename__ = 'likes'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    item_type = db.Column(db.String(50), nullable=False)  # project, achievement, comment
    item_id = db.Column(db.String(36), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Comment(db.Model):
    __tablename__ = 'comments'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=True)  # Allow anonymous comments
    author_name = db.Column(db.String(100))  # For anonymous comments
    author_email = db.Column(db.String(255))  # For anonymous comments
    item_type = db.Column(db.String(50), nullable=False)  # project, achievement
    item_id = db.Column(db.String(36), nullable=False)
    content = db.Column(db.Text, nullable=False)
    parent_id = db.Column(db.String(36))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class File(db.Model):
    __tablename__ = 'files'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    filename = db.Column(db.String(255), nullable=False)
    original_name = db.Column(db.String(255), nullable=False)
    mimetype = db.Column(db.String(100), nullable=False)
    size = db.Column(db.Integer, nullable=False)
    path = db.Column(db.String(500), nullable=False)
    url = db.Column(db.String(500), nullable=False)
    uploaded_by = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Content(db.Model):
    __tablename__ = 'content'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    section = db.Column(db.String(100), nullable=False)
    field = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Ensure unique combination of section and field
    __table_args__ = (db.UniqueConstraint('section', 'field', name='unique_section_field'),)

    def to_dict(self):
        return {
            'id': self.id,
            'section': self.section,
            'field': self.field,
            'content': self.content,
            'createdAt': self.created_at.isoformat(),
            'updatedAt': self.updated_at.isoformat()
        }


# Session table is handled automatically by Flask-Session