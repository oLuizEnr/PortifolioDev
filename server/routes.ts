import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import { insertProjectSchema, insertExperienceSchema, insertAchievementSchema, insertCommentSchema } from "@shared/schema";
import { z } from "zod";
import { upload, UploadService } from "./upload";
import express from "express";


export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Serve static files from uploads directory
  app.use('/uploads', express.static('uploads'));

  // Auth routes
  app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      req.session!.userId = user.id;
      res.json({ message: "Login successful", user: { ...user, password: undefined } });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post('/api/logout', (req, res) => {
    req.session?.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      res.json({ ...req.user, password: undefined });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Admin middleware
  const isAdmin = async (req: any, res: any, next: any) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };

  // Public routes
  app.get('/api/projects', async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get('/api/projects/featured', async (req, res) => {
    try {
      const projects = await storage.getFeaturedProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching featured projects:", error);
      res.status(500).json({ message: "Failed to fetch featured projects" });
    }
  });

  app.get('/api/projects/:id', async (req, res) => {
    try {
      const project = await storage.getProjectById(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.get('/api/experiences', async (req, res) => {
    try {
      const experiences = await storage.getExperiences();
      res.json(experiences);
    } catch (error) {
      console.error("Error fetching experiences:", error);
      res.status(500).json({ message: "Failed to fetch experiences" });
    }
  });

  app.get('/api/achievements', async (req, res) => {
    try {
      const achievements = await storage.getAchievements();
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  // Protected routes for projects
  app.post('/api/projects', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const data = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(data);
      res.json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.put('/api/projects/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const data = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(req.params.id, data);
      res.json(project);
    } catch (error) {
      console.error("Error updating project:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete('/api/projects/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
      await storage.deleteProject(req.params.id);
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Protected routes for experiences
  app.post('/api/experiences', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const data = insertExperienceSchema.parse(req.body);
      const experience = await storage.createExperience(data);
      res.json(experience);
    } catch (error) {
      console.error("Error creating experience:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create experience" });
    }
  });

  app.put('/api/experiences/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const data = insertExperienceSchema.partial().parse(req.body);
      const experience = await storage.updateExperience(req.params.id, data);
      res.json(experience);
    } catch (error) {
      console.error("Error updating experience:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update experience" });
    }
  });

  app.delete('/api/experiences/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
      await storage.deleteExperience(req.params.id);
      res.json({ message: "Experience deleted successfully" });
    } catch (error) {
      console.error("Error deleting experience:", error);
      res.status(500).json({ message: "Failed to delete experience" });
    }
  });

  // Protected routes for achievements
  app.post('/api/achievements', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const data = insertAchievementSchema.parse(req.body);
      const achievement = await storage.createAchievement(data);
      res.json(achievement);
    } catch (error) {
      console.error("Error creating achievement:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create achievement" });
    }
  });

  app.put('/api/achievements/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const data = insertAchievementSchema.partial().parse(req.body);
      const achievement = await storage.updateAchievement(req.params.id, data);
      res.json(achievement);
    } catch (error) {
      console.error("Error updating achievement:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update achievement" });
    }
  });

  app.delete('/api/achievements/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
      await storage.deleteAchievement(req.params.id);
      res.json({ message: "Achievement deleted successfully" });
    } catch (error) {
      console.error("Error deleting achievement:", error);
      res.status(500).json({ message: "Failed to delete achievement" });
    }
  });

  // Comments routes
  app.get('/api/comments/:itemType/:itemId', async (req, res) => {
    try {
      const { itemType, itemId } = req.params;
      const comments = await storage.getComments(itemType, itemId);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post('/api/comments', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.id;
      const data = insertCommentSchema.parse({ ...req.body, userId });
      const comment = await storage.createComment(data);
      res.json(comment);
    } catch (error) {
      console.error("Error creating comment:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  // Likes routes
  app.post('/api/likes', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.id;
      const { itemType, itemId } = req.body;
      
      if (!itemType || !itemId) {
        return res.status(400).json({ message: "itemType and itemId are required" });
      }

      const result = await storage.toggleLike(userId, itemType, itemId);
      res.json(result);
    } catch (error) {
      console.error("Error toggling like:", error);
      res.status(500).json({ message: "Failed to toggle like" });
    }
  });

  app.get('/api/likes/:itemType/:itemId', async (req, res) => {
    try {
      const { itemType, itemId } = req.params;
      const count = await storage.getLikeCount(itemType, itemId);
      
      let userLiked = false;
      if (req.user?.id) {
        const userLike = await storage.getUserLike(req.user.id, itemType, itemId);
        userLiked = !!userLike;
      }

      res.json({ count, userLiked });
    } catch (error) {
      console.error("Error fetching likes:", error);
      res.status(500).json({ message: "Failed to fetch likes" });
    }
  });

  // File upload routes
  app.post('/api/upload', isAuthenticated, isAdmin, upload.single('file'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const userId = req.user.id;
      const fileRecord = await UploadService.saveFileRecord(req.file, userId);
      res.json({ 
        id: fileRecord.id,
        url: fileRecord.url,
        filename: fileRecord.filename,
        originalName: fileRecord.originalName
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  app.delete('/api/files/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
      await UploadService.deleteFile(req.params.id);
      res.json({ message: "File deleted successfully" });
    } catch (error) {
      console.error("Error deleting file:", error);
      res.status(500).json({ message: "Failed to delete file" });
    }
  });

  // Admin routes for managing user profile (LinkedIn, etc.)
  app.put('/api/admin/profile', isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { linkedinUrl, firstName, lastName, profileImageUrl } = req.body;
      
      // Update user profile
      const updatedUser = await storage.upsertUser({
        id: userId,
        email: req.user.email,
        password: req.user.password,
        linkedinUrl,
        firstName,
        lastName,
        profileImageUrl,
        isAdmin: req.user.isAdmin
      });
      
      res.json({ ...updatedUser, password: undefined });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Admin route to get all projects (published and unpublished)
  app.get('/api/admin/projects', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const projects = await storage.getAllProjects(); // We need to add this method
      res.json(projects);
    } catch (error) {
      console.error("Error fetching all projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  // Admin route to get all experiences (published and unpublished)
  app.get('/api/admin/experiences', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const experiences = await storage.getAllExperiences(); // We need to add this method
      res.json(experiences);
    } catch (error) {
      console.error("Error fetching all experiences:", error);
      res.status(500).json({ message: "Failed to fetch experiences" });
    }
  });

  // Admin route to get all achievements (published and unpublished)
  app.get('/api/admin/achievements', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const achievements = await storage.getAllAchievements(); // We need to add this method
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching all achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  // Contact form endpoint
  app.post('/api/contact', async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // In a real application, you would send an email to the admin
      // For now, we'll just log it and return success
      console.log("Contact form submission:", { name, email, subject, message });
      
      res.json({ message: "Message sent successfully" });
    } catch (error) {
      console.error("Error processing contact form:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
