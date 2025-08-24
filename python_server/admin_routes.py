from flask import request, jsonify, session
from models import db, User, Project, Experience, Achievement, Like, Comment, File
from datetime import datetime
import uuid

def admin_routes(app):
    
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

    def login_required(f):
        def decorated_function(*args, **kwargs):
            if 'user_id' not in session:
                return jsonify({'message': 'Unauthorized'}), 401
            return f(*args, **kwargs)
        decorated_function.__name__ = f.__name__
        return decorated_function

    # Helper functions
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
            'createdAt': achievement.created_at.isoformat() if achievement.created_at else None,
            'updatedAt': achievement.updated_at.isoformat() if achievement.updated_at else None
        }

    # Admin Projects Routes
    @app.route('/api/admin/projects', methods=['GET'])
    @login_required
    @admin_required
    def get_all_projects():
        try:
            projects = Project.query.all()
            return jsonify([project_to_dict(p) for p in projects])
        except Exception as e:
            return jsonify({'message': 'Failed to fetch projects'}), 500

    @app.route('/api/projects', methods=['POST'])
    @login_required
    @admin_required
    def create_project():
        try:
            data = request.get_json()
            
            project = Project()
            project.title = data.get('title')
            project.description = data.get('description')
            project.image_url = data.get('imageUrl')
            project.github_url = data.get('githubUrl')
            project.live_url = data.get('liveUrl')
            project.technologies = data.get('technologies', [])
            project.featured = data.get('featured', False)
            project.published = data.get('published', False)
            project.linkedin_post = data.get('linkedinPost')
            
            db.session.add(project)
            db.session.commit()
            
            return jsonify(project_to_dict(project))
        except Exception as e:
            return jsonify({'message': 'Failed to create project'}), 500

    @app.route('/api/projects/<project_id>', methods=['PUT'])
    @login_required
    @admin_required
    def update_project(project_id):
        try:
            project = Project.query.get(project_id)
            if not project:
                return jsonify({'message': 'Project not found'}), 404
            
            data = request.get_json()
            
            if 'title' in data:
                project.title = data['title']
            if 'description' in data:
                project.description = data['description']
            if 'imageUrl' in data:
                project.image_url = data['imageUrl']
            if 'githubUrl' in data:
                project.github_url = data['githubUrl']
            if 'liveUrl' in data:
                project.live_url = data['liveUrl']
            if 'technologies' in data:
                project.technologies = data['technologies']
            if 'featured' in data:
                project.featured = data['featured']
            if 'published' in data:
                project.published = data['published']
            if 'linkedinPost' in data:
                project.linkedin_post = data['linkedinPost']
            
            project.updated_at = datetime.utcnow()
            db.session.commit()
            
            return jsonify(project_to_dict(project))
        except Exception as e:
            return jsonify({'message': 'Failed to update project'}), 500

    @app.route('/api/projects/<project_id>', methods=['DELETE'])
    @login_required
    @admin_required
    def delete_project(project_id):
        try:
            project = Project.query.get(project_id)
            if not project:
                return jsonify({'message': 'Project not found'}), 404
            
            db.session.delete(project)
            db.session.commit()
            
            return jsonify({'message': 'Project deleted successfully'})
        except Exception as e:
            return jsonify({'message': 'Failed to delete project'}), 500

    # Admin Experience Routes
    @app.route('/api/admin/experiences', methods=['GET'])
    @login_required
    @admin_required
    def get_all_experiences():
        try:
            experiences = Experience.query.all()
            return jsonify([experience_to_dict(e) for e in experiences])
        except Exception as e:
            return jsonify({'message': 'Failed to fetch experiences'}), 500

    @app.route('/api/experiences', methods=['POST'])
    @login_required
    @admin_required
    def create_experience():
        try:
            data = request.get_json()
            
            start_date = datetime.fromisoformat(data['startDate'].replace('Z', '+00:00')) if data.get('startDate') else None
            end_date = datetime.fromisoformat(data['endDate'].replace('Z', '+00:00')) if data.get('endDate') else None
            
            experience = Experience()
            experience.position = data.get('position')
            experience.company = data.get('company')
            experience.start_date = start_date
            experience.end_date = end_date
            experience.description = data.get('description')
            experience.technologies = data.get('technologies', [])
            experience.published = data.get('published', False)
            
            db.session.add(experience)
            db.session.commit()
            
            return jsonify(experience_to_dict(experience))
        except Exception as e:
            return jsonify({'message': 'Failed to create experience'}), 500

    @app.route('/api/experiences/<experience_id>', methods=['PUT'])
    @login_required
    @admin_required
    def update_experience(experience_id):
        try:
            experience = Experience.query.get(experience_id)
            if not experience:
                return jsonify({'message': 'Experience not found'}), 404
            
            data = request.get_json()
            
            if 'position' in data:
                experience.position = data['position']
            if 'company' in data:
                experience.company = data['company']
            if 'startDate' in data and data['startDate']:
                experience.start_date = datetime.fromisoformat(data['startDate'].replace('Z', '+00:00'))
            if 'endDate' in data:
                experience.end_date = datetime.fromisoformat(data['endDate'].replace('Z', '+00:00')) if data['endDate'] else None
            if 'description' in data:
                experience.description = data['description']
            if 'technologies' in data:
                experience.technologies = data['technologies']
            if 'published' in data:
                experience.published = data['published']
            
            experience.updated_at = datetime.utcnow()
            db.session.commit()
            
            return jsonify(experience_to_dict(experience))
        except Exception as e:
            return jsonify({'message': 'Failed to update experience'}), 500

    @app.route('/api/experiences/<experience_id>', methods=['DELETE'])
    @login_required
    @admin_required
    def delete_experience(experience_id):
        try:
            experience = Experience.query.get(experience_id)
            if not experience:
                return jsonify({'message': 'Experience not found'}), 404
            
            db.session.delete(experience)
            db.session.commit()
            
            return jsonify({'message': 'Experience deleted successfully'})
        except Exception as e:
            return jsonify({'message': 'Failed to delete experience'}), 500

    # Admin Achievement Routes
    @app.route('/api/admin/achievements', methods=['GET'])
    @login_required
    @admin_required
    def get_all_achievements():
        try:
            achievements = Achievement.query.all()
            return jsonify([achievement_to_dict(a) for a in achievements])
        except Exception as e:
            return jsonify({'message': 'Failed to fetch achievements'}), 500

    @app.route('/api/achievements', methods=['POST'])
    @login_required
    @admin_required
    def create_achievement():
        try:
            data = request.get_json()
            
            date = datetime.fromisoformat(data['date'].replace('Z', '+00:00')) if data.get('date') else None
            
            achievement = Achievement()
            achievement.title = data.get('title')
            achievement.description = data.get('description')
            achievement.date = date
            achievement.type = data.get('type')
            achievement.certificate_url = data.get('certificateUrl')
            achievement.published = data.get('published', False)
            
            db.session.add(achievement)
            db.session.commit()
            
            return jsonify(achievement_to_dict(achievement))
        except Exception as e:
            return jsonify({'message': 'Failed to create achievement'}), 500

    @app.route('/api/achievements/<achievement_id>', methods=['PUT'])
    @login_required
    @admin_required
    def update_achievement(achievement_id):
        try:
            achievement = Achievement.query.get(achievement_id)
            if not achievement:
                return jsonify({'message': 'Achievement not found'}), 404
            
            data = request.get_json()
            
            if 'title' in data:
                achievement.title = data['title']
            if 'description' in data:
                achievement.description = data['description']
            if 'date' in data and data['date']:
                achievement.date = datetime.fromisoformat(data['date'].replace('Z', '+00:00'))
            if 'type' in data:
                achievement.type = data['type']
            if 'certificateUrl' in data:
                achievement.certificate_url = data['certificateUrl']
            if 'published' in data:
                achievement.published = data['published']
            
            achievement.updated_at = datetime.utcnow()
            db.session.commit()
            
            return jsonify(achievement_to_dict(achievement))
        except Exception as e:
            return jsonify({'message': 'Failed to update achievement'}), 500

    @app.route('/api/achievements/<achievement_id>', methods=['DELETE'])
    @login_required
    @admin_required
    def delete_achievement(achievement_id):
        try:
            achievement = Achievement.query.get(achievement_id)
            if not achievement:
                return jsonify({'message': 'Achievement not found'}), 404
            
            db.session.delete(achievement)
            db.session.commit()
            
            return jsonify({'message': 'Achievement deleted successfully'})
        except Exception as e:
            return jsonify({'message': 'Failed to delete achievement'}), 500

    # Comments Routes
    @app.route('/api/comments/<item_type>/<item_id>', methods=['GET'])
    def get_comments(item_type, item_id):
        try:
            comments = Comment.query.filter_by(item_type=item_type, item_id=item_id).all()
            return jsonify([{
                'id': c.id,
                'userId': c.user_id,
                'itemType': c.item_type,
                'itemId': c.item_id,
                'content': c.content,
                'parentId': c.parent_id,
                'createdAt': c.created_at.isoformat() if c.created_at else None,
                'updatedAt': c.updated_at.isoformat() if c.updated_at else None
            } for c in comments])
        except Exception as e:
            return jsonify({'message': 'Failed to fetch comments'}), 500

    @app.route('/api/comments', methods=['POST'])
    @login_required
    def create_comment():
        try:
            data = request.get_json()
            user_id = session['user_id']
            
            comment = Comment()
            comment.user_id = user_id
            comment.item_type = data.get('itemType')
            comment.item_id = data.get('itemId')
            comment.content = data.get('content')
            comment.parent_id = data.get('parentId')
            
            db.session.add(comment)
            db.session.commit()
            
            return jsonify({
                'id': comment.id,
                'userId': comment.user_id,
                'itemType': comment.item_type,
                'itemId': comment.item_id,
                'content': comment.content,
                'parentId': comment.parent_id,
                'createdAt': comment.created_at.isoformat() if comment.created_at else None,
                'updatedAt': comment.updated_at.isoformat() if comment.updated_at else None
            })
        except Exception as e:
            return jsonify({'message': 'Failed to create comment'}), 500

    # Likes Routes
    @app.route('/api/likes', methods=['POST'])
    @login_required
    def toggle_like():
        try:
            data = request.get_json()
            user_id = session['user_id']
            item_type = data.get('itemType')
            item_id = data.get('itemId')
            
            if not item_type or not item_id:
                return jsonify({'message': 'itemType and itemId are required'}), 400
            
            # Check if like already exists
            existing_like = Like.query.filter_by(
                user_id=user_id,
                item_type=item_type,
                item_id=item_id
            ).first()
            
            if existing_like:
                # Unlike
                db.session.delete(existing_like)
                db.session.commit()
                return jsonify({'liked': False, 'message': 'Like removed'})
            else:
                # Like
                like = Like()
                like.user_id = user_id
                like.item_type = item_type
                like.item_id = item_id
                db.session.add(like)
                db.session.commit()
                return jsonify({'liked': True, 'message': 'Like added'})
                
        except Exception as e:
            return jsonify({'message': 'Failed to toggle like'}), 500

    @app.route('/api/likes/<item_type>/<item_id>', methods=['GET'])
    def get_likes(item_type, item_id):
        try:
            count = Like.query.filter_by(item_type=item_type, item_id=item_id).count()
            
            user_liked = False
            if 'user_id' in session:
                user_like = Like.query.filter_by(
                    user_id=session['user_id'],
                    item_type=item_type,
                    item_id=item_id
                ).first()
                user_liked = bool(user_like)
            
            return jsonify({
                'count': count,
                'userLiked': user_liked
            })
        except Exception as e:
            return jsonify({'message': 'Failed to fetch likes'}), 500

    # Admin Profile Routes
    @app.route('/api/admin/profile', methods=['PUT'])
    @login_required
    @admin_required
    def update_admin_profile():
        try:
            user_id = session['user_id']
            user = User.query.get(user_id)
            
            if not user:
                return jsonify({'message': 'User not found'}), 404
            
            data = request.get_json()
            
            if 'firstName' in data:
                user.first_name = data['firstName']
            if 'lastName' in data:
                user.last_name = data['lastName']
            if 'linkedinUrl' in data:
                user.linkedin_url = data['linkedinUrl']
            if 'githubUrl' in data:
                user.github_url = data['githubUrl']
            if 'profileImageUrl' in data:
                user.profile_image_url = data['profileImageUrl']
            if 'heroImageUrl' in data:
                user.hero_image_url = data['heroImageUrl']
            
            user.updated_at = datetime.utcnow()
            db.session.commit()
            
            return jsonify({
                'id': user.id,
                'email': user.email,
                'firstName': user.first_name,
                'lastName': user.last_name,
                'profileImageUrl': user.profile_image_url,
                'heroImageUrl': user.hero_image_url,
                'linkedinUrl': user.linkedin_url,
                'githubUrl': user.github_url,
                'isAdmin': user.is_admin
            })
        except Exception as e:
            return jsonify({'message': 'Failed to update profile'}), 500