import multer from 'multer';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { db } from './db';
import { files, type File } from '@shared/schema';
import { eq } from 'drizzle-orm';

// Ensure uploads directory exists
const uploadsDir = './uploads';
if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  }
});

// File filter for images and gifs
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Apenas imagens (JPEG, PNG, GIF, WebP) são permitidas'));
  }
};

export const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  }
});

// Upload service functions
export class UploadService {
  static async saveFileRecord(file: Express.Multer.File, userId: string): Promise<File> {
    const fileRecord = {
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
      url: `/uploads/${file.filename}`,
      uploadedBy: userId
    };

    const [savedFile] = await db.insert(files).values(fileRecord).returning();
    return savedFile;
  }

  static async getFileById(id: string): Promise<File | undefined> {
    const [file] = await db.select().from(files).where(eq(files.id, id));
    return file;
  }

  static async deleteFile(id: string): Promise<void> {
    const file = await this.getFileById(id);
    if (file) {
      // Delete physical file
      const fs = require('fs');
      try {
        fs.unlinkSync(file.path);
      } catch (error) {
        console.error('Error deleting physical file:', error);
      }
      
      // Delete database record
      await db.delete(files).where(eq(files.id, id));
    }
  }
}

