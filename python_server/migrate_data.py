#!/usr/bin/env python3
"""
Script to migrate data from the existing Node.js SQLite database to the new Python database.
"""

import sqlite3
import json
from datetime import datetime
from app import app
from models import db, User, Project, Experience, Achievement, Like, Comment, File

def migrate_data():
    # Connect to the existing database
    old_conn = sqlite3.connect('../data/database.db')
    old_conn.row_factory = sqlite3.Row
    
    with app.app_context():
        # Create new tables
        db.create_all()
        
        print("Migrating users...")
        migrate_users(old_conn)
        
        print("Migrating projects...")
        migrate_projects(old_conn)
        
        print("Migrating experiences...")
        migrate_experiences(old_conn)
        
        print("Migrating achievements...")
        migrate_achievements(old_conn)
        
        print("Migrating comments...")
        migrate_comments(old_conn)
        
        print("Migrating likes...")
        migrate_likes(old_conn)
        
        print("Migrating files...")
        migrate_files(old_conn)
        
        db.session.commit()
        print("Migration completed successfully!")

def convert_timestamp(timestamp):
    """Convert timestamp from milliseconds to datetime"""
    if timestamp is None:
        return None
    if isinstance(timestamp, int):
        return datetime.fromtimestamp(timestamp / 1000)  # Convert from milliseconds
    return timestamp

def migrate_users(old_conn):
    cursor = old_conn.execute("SELECT * FROM users")
    users = cursor.fetchall()
    
    for user_row in users:
        # Check if user already exists
        existing = User.query.filter_by(email=user_row['email']).first()
        if existing:
            continue
            
        user = User()
        user.id = user_row['id']
        user.email = user_row['email']
        user.password = user_row['password']
        user.first_name = user_row['first_name']
        user.last_name = user_row['last_name']
        user.profile_image_url = user_row['profile_image_url']
        user.hero_image_url = user_row['hero_image_url']
        user.linkedin_url = user_row['linkedin_url']
        user.github_url = user_row['github_url']
        user.is_admin = bool(user_row['is_admin'])
        user.created_at = convert_timestamp(user_row['created_at'])
        user.updated_at = convert_timestamp(user_row['updated_at'])
        
        db.session.add(user)
        print(f"Migrated user: {user.email}")

def migrate_projects(old_conn):
    cursor = old_conn.execute("SELECT * FROM projects")
    projects = cursor.fetchall()
    
    for project_row in projects:
        # Check if project already exists
        existing = Project.query.filter_by(id=project_row['id']).first()
        if existing:
            continue
            
        project = Project()
        project.id = project_row['id']
        project.title = project_row['title']
        project.description = project_row['description']
        project.image_url = project_row['image_url']
        project.github_url = project_row['github_url']
        project.live_url = project_row['live_url']
        
        # Parse JSON technologies
        try:
            if project_row['technologies']:
                project.technologies = json.loads(project_row['technologies'])
            else:
                project.technologies = []
        except (json.JSONDecodeError, TypeError):
            project.technologies = []
            
        project.featured = bool(project_row['featured'])
        project.published = bool(project_row['published'])
        project.linkedin_post = project_row['linkedin_post']
        project.created_at = convert_timestamp(project_row['created_at'])
        project.updated_at = convert_timestamp(project_row['updated_at'])
        
        db.session.add(project)
        print(f"Migrated project: {project.title}")

def migrate_experiences(old_conn):
    cursor = old_conn.execute("SELECT * FROM experiences")
    experiences = cursor.fetchall()
    
    for exp_row in experiences:
        # Check if experience already exists
        existing = Experience.query.filter_by(id=exp_row['id']).first()
        if existing:
            continue
            
        experience = Experience()
        experience.id = exp_row['id']
        experience.position = exp_row['position']
        experience.company = exp_row['company']
        experience.start_date = convert_timestamp(exp_row['start_date'])
        experience.end_date = convert_timestamp(exp_row['end_date'])
        experience.description = exp_row['description']
        
        # Parse JSON technologies
        try:
            if exp_row['technologies']:
                experience.technologies = json.loads(exp_row['technologies'])
            else:
                experience.technologies = []
        except (json.JSONDecodeError, TypeError):
            experience.technologies = []
            
        experience.published = bool(exp_row['published'])
        experience.created_at = convert_timestamp(exp_row['created_at'])
        experience.updated_at = convert_timestamp(exp_row['updated_at'])
        
        db.session.add(experience)
        print(f"Migrated experience: {experience.position} at {experience.company}")

def migrate_achievements(old_conn):
    cursor = old_conn.execute("SELECT * FROM achievements")
    achievements = cursor.fetchall()
    
    for ach_row in achievements:
        # Check if achievement already exists
        existing = Achievement.query.filter_by(id=ach_row['id']).first()
        if existing:
            continue
            
        achievement = Achievement()
        achievement.id = ach_row['id']
        achievement.title = ach_row['title']
        achievement.description = ach_row['description']
        achievement.date = convert_timestamp(ach_row['date'])
        achievement.type = ach_row['type']
        achievement.certificate_url = ach_row['certificate_url']
        achievement.published = bool(ach_row['published'])
        achievement.created_at = convert_timestamp(ach_row['created_at'])
        achievement.updated_at = convert_timestamp(ach_row['updated_at'])
        
        db.session.add(achievement)
        print(f"Migrated achievement: {achievement.title}")

def migrate_comments(old_conn):
    try:
        cursor = old_conn.execute("SELECT * FROM comments")
        comments = cursor.fetchall()
        
        for comment_row in comments:
            # Check if comment already exists
            existing = Comment.query.filter_by(id=comment_row['id']).first()
            if existing:
                continue
                
            comment = Comment()
            comment.id = comment_row['id']
            comment.user_id = comment_row['user_id']
            comment.item_type = comment_row['item_type']
            comment.item_id = comment_row['item_id']
            comment.content = comment_row['content']
            comment.parent_id = comment_row['parent_id']
            comment.created_at = convert_timestamp(comment_row['created_at'])
            comment.updated_at = convert_timestamp(comment_row['updated_at'])
            
            db.session.add(comment)
            print(f"Migrated comment: {comment.id}")
    except sqlite3.OperationalError:
        print("Comments table not found, skipping...")

def migrate_likes(old_conn):
    try:
        cursor = old_conn.execute("SELECT * FROM likes")
        likes = cursor.fetchall()
        
        for like_row in likes:
            # Check if like already exists
            existing = Like.query.filter_by(id=like_row['id']).first()
            if existing:
                continue
                
            like = Like()
            like.id = like_row['id']
            like.user_id = like_row['user_id']
            like.item_type = like_row['item_type']
            like.item_id = like_row['item_id']
            like.created_at = convert_timestamp(like_row['created_at'])
            
            db.session.add(like)
            print(f"Migrated like: {like.id}")
    except sqlite3.OperationalError:
        print("Likes table not found, skipping...")

def migrate_files(old_conn):
    try:
        cursor = old_conn.execute("SELECT * FROM files")
        files = cursor.fetchall()
        
        for file_row in files:
            # Check if file already exists
            existing = File.query.filter_by(id=file_row['id']).first()
            if existing:
                continue
                
            file_record = File()
            file_record.id = file_row['id']
            file_record.filename = file_row['filename']
            file_record.original_name = file_row['original_name']
            file_record.mimetype = file_row['mimetype']
            file_record.size = file_row['size']
            file_record.path = file_row['path']
            file_record.url = file_row['url']
            file_record.uploaded_by = file_row['uploaded_by']
            file_record.created_at = convert_timestamp(file_row['created_at'])
            
            db.session.add(file_record)
            print(f"Migrated file: {file_record.filename}")
    except sqlite3.OperationalError:
        print("Files table not found, skipping...")

if __name__ == '__main__':
    migrate_data()