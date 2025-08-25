// Placeholder schema for frontend compatibility
// This file is needed for frontend build but not used in Python backend
import { z } from "zod";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  heroImageUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  technologies: string[];
  featured: boolean;
  published: boolean;
  linkedinPost?: string;
  linkedinPostUrl?: string;
  additionalImages: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Experience {
  id: string;
  position: string;
  company: string;
  startDate: string;
  endDate?: string;
  description: string;
  technologies: string[];
  published: boolean;
  linkedinPost?: string;
  linkedinPostUrl?: string;
  companyLogoUrl?: string;
  additionalImages: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  type: string;
  certificateUrl?: string;
  published: boolean;
  linkedinPost?: string;
  linkedinPostUrl?: string;
  badgeImageUrl?: string;
  additionalImages: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  userId?: string;
  authorName?: string;
  authorEmail?: string;
  itemType: string;
  itemId: string;
  content: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

// Zod schemas for validation
export const insertProjectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  imageUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  liveUrl: z.string().optional(),
  technologies: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  linkedinPost: z.string().optional(),
  linkedinPostUrl: z.string().optional(),
  additionalImages: z.array(z.string()).default([])
});

export const insertExperienceSchema = z.object({
  position: z.string().min(1),
  company: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  description: z.string().min(1),
  technologies: z.array(z.string()).default([]),
  published: z.boolean().default(false),
  linkedinPost: z.string().optional(),
  linkedinPostUrl: z.string().optional(),
  companyLogoUrl: z.string().optional(),
  additionalImages: z.array(z.string()).default([])
});

export const insertAchievementSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.string().min(1),
  type: z.string().min(1),
  certificateUrl: z.string().optional(),
  published: z.boolean().default(false),
  linkedinPost: z.string().optional(),
  linkedinPostUrl: z.string().optional(),
  badgeImageUrl: z.string().optional(),
  additionalImages: z.array(z.string()).default([])
});