import os
import uuid
from datetime import datetime
from werkzeug.utils import secure_filename
from werkzeug.datastructures import FileStorage
from models import db, File

UPLOAD_FOLDER = 'static'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp', 'pdf', 'doc', 'docx'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_file_extension(filename):
    return filename.rsplit('.', 1)[1].lower() if '.' in filename else ''

def generate_unique_filename(original_filename):
    """Generate a unique filename while preserving the extension"""
    extension = get_file_extension(original_filename)
    base_name = secure_filename(original_filename.rsplit('.', 1)[0])
    unique_suffix = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{str(uuid.uuid4())[:8]}"
    return f"{base_name}_{unique_suffix}.{extension}"

class UploadService:
    @staticmethod
    def save_file(file: FileStorage, user_id: str) -> dict:
        """Save uploaded file and return file info"""
        if not file or file.filename == '':
            raise ValueError('No file selected')
        
        if not allowed_file(file.filename):
            raise ValueError('File type not allowed')
        
        # Create upload directory if it doesn't exist
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        
        # Generate unique filename
        filename = generate_unique_filename(file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        
        # Save file
        file.save(file_path)
        
        # Get file size
        file_size = os.path.getsize(file_path)
        
        if file_size > MAX_FILE_SIZE:
            # Remove file if too large
            os.remove(file_path)
            raise ValueError('File too large')
        
        # Create file record
        file_record = File()
        file_record.filename = filename
        file_record.original_name = file.filename
        file_record.mimetype = file.mimetype or 'application/octet-stream'
        file_record.size = file_size
        file_record.path = file_path
        file_record.url = f'/static/{filename}'
        file_record.uploaded_by = user_id
        
        db.session.add(file_record)
        db.session.commit()
        
        return {
            'id': file_record.id,
            'url': file_record.url,
            'filename': file_record.filename,
            'originalName': file_record.original_name,
            'size': file_record.size,
            'mimetype': file_record.mimetype
        }
    
    @staticmethod
    def delete_file(file_id: str) -> bool:
        """Delete file and its record"""
        file_record = File.query.get(file_id)
        if not file_record:
            return False
        
        # Delete physical file
        try:
            if os.path.exists(file_record.path):
                os.remove(file_record.path)
        except Exception as e:
            print(f"Error deleting physical file: {e}")
        
        # Delete database record
        db.session.delete(file_record)
        db.session.commit()
        
        return True
    
    @staticmethod
    def get_file_info(file_id: str) -> dict:
        """Get file information"""
        file_record = File.query.get(file_id)
        if not file_record:
            return None
        
        return {
            'id': file_record.id,
            'url': file_record.url,
            'filename': file_record.filename,
            'originalName': file_record.original_name,
            'size': file_record.size,
            'mimetype': file_record.mimetype,
            'uploadedBy': file_record.uploaded_by,
            'createdAt': file_record.created_at.isoformat() if file_record.created_at else None
        }