import {
  users,
  projects,
  experiences,
  achievements,
  comments,
  likes,
  type User,
  type UpsertUser,
  type Project,
  type InsertProject,
  type Experience,
  type InsertExperience,
  type Achievement,
  type InsertAchievement,
  type Comment,
  type InsertComment,
  type Like,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  // User operations - local auth
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(userData: UpsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  initializeDefaultUser(): Promise<void>;

  // Project operations
  getProjects(): Promise<Project[]>;
  getFeaturedProjects(): Promise<Project[]>;
  getProjectById(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: string): Promise<void>;

  // Experience operations
  getExperiences(): Promise<Experience[]>;
  getExperienceById(id: string): Promise<Experience | undefined>;
  createExperience(experience: InsertExperience): Promise<Experience>;
  updateExperience(id: string, experience: Partial<InsertExperience>): Promise<Experience>;
  deleteExperience(id: string): Promise<void>;

  // Achievement operations
  getAchievements(): Promise<Achievement[]>;
  getAchievementById(id: string): Promise<Achievement | undefined>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  updateAchievement(id: string, achievement: Partial<InsertAchievement>): Promise<Achievement>;
  deleteAchievement(id: string): Promise<void>;

  // Comment operations
  getComments(itemType: string, itemId: string): Promise<(Comment & { user: User; replies: Comment[] })[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  deleteComment(id: string): Promise<void>;

  // Like operations
  toggleLike(userId: string, itemType: string, itemId: string): Promise<{ liked: boolean; count: number }>;
  getLikeCount(itemType: string, itemId: string): Promise<number>;
  getUserLike(userId: string, itemType: string, itemId: string): Promise<Like | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: UpsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.email,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async initializeDefaultUser(): Promise<void> {
    const existingUser = await this.getUserByEmail("teste@teste");
    if (!existingUser) {
      await this.createUser({
        email: "teste@teste",
        password: "01234567",
        firstName: "Luiz",
        lastName: "Enrique",
        isAdmin: true,
      });
    }
  }

  async getProjects(): Promise<Project[]> {
    const results = await db
      .select()
      .from(projects)
      .where(eq(projects.published, true))
      .orderBy(desc(projects.createdAt));
    return results.map(project => ({
      ...project,
      technologies: project.technologies ? JSON.parse(project.technologies as unknown as string) : []
    }));
  }

  async getAllProjects(): Promise<Project[]> {
    const results = await db
      .select()
      .from(projects)
      .orderBy(desc(projects.createdAt));
    return results.map(project => ({
      ...project,
      technologies: project.technologies ? JSON.parse(project.technologies as unknown as string) : []
    }));
  }

  async getFeaturedProjects(): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(and(eq(projects.published, true), eq(projects.featured, true)))
      .orderBy(desc(projects.createdAt));
  }

  async getProjectById(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const projectData = {
      ...project,
      technologies: project.technologies ? JSON.stringify(project.technologies) : null
    };
    const [newProject] = await db.insert(projects).values(projectData as any).returning();
    return {
      ...newProject,
      technologies: newProject.technologies ? JSON.parse(newProject.technologies as unknown as string) : []
    };
  }

  async updateProject(id: string, project: Partial<InsertProject>): Promise<Project> {
    const projectData = {
      ...project,
      technologies: project.technologies ? JSON.stringify(project.technologies) : undefined,
      updatedAt: Date.now()
    };
    const [updatedProject] = await db
      .update(projects)
      .set(projectData as any)
      .where(eq(projects.id, id))
      .returning();
    return {
      ...updatedProject,
      technologies: updatedProject.technologies ? JSON.parse(updatedProject.technologies as unknown as string) : []
    };
  }

  async deleteProject(id: string): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  async getExperiences(): Promise<Experience[]> {
    const results = await db
      .select()
      .from(experiences)
      .where(eq(experiences.published, true))
      .orderBy(desc(experiences.startDate));
    return results.map(experience => ({
      ...experience,
      technologies: experience.technologies ? JSON.parse(experience.technologies as unknown as string) : []
    }));
  }

  async getAllExperiences(): Promise<Experience[]> {
    const results = await db
      .select()
      .from(experiences)
      .orderBy(desc(experiences.startDate));
    return results.map(experience => ({
      ...experience,
      technologies: experience.technologies ? JSON.parse(experience.technologies as unknown as string) : []
    }));
  }

  async getExperienceById(id: string): Promise<Experience | undefined> {
    const [experience] = await db.select().from(experiences).where(eq(experiences.id, id));
    return experience;
  }

  async createExperience(experience: InsertExperience): Promise<Experience> {
    const experienceData = {
      ...experience,
      technologies: experience.technologies ? JSON.stringify(experience.technologies) : null
    };
    const [newExperience] = await db.insert(experiences).values(experienceData as any).returning();
    return {
      ...newExperience,
      technologies: newExperience.technologies ? JSON.parse(newExperience.technologies as unknown as string) : []
    };
  }

  async updateExperience(id: string, experience: Partial<InsertExperience>): Promise<Experience> {
    const experienceData = {
      ...experience,
      technologies: experience.technologies ? JSON.stringify(experience.technologies) : undefined,
      updatedAt: Date.now()
    };
    const [updatedExperience] = await db
      .update(experiences)
      .set(experienceData as any)
      .where(eq(experiences.id, id))
      .returning();
    return {
      ...updatedExperience,
      technologies: updatedExperience.technologies ? JSON.parse(updatedExperience.technologies as unknown as string) : []
    };
  }

  async deleteExperience(id: string): Promise<void> {
    await db.delete(experiences).where(eq(experiences.id, id));
  }

  async getAchievements(): Promise<Achievement[]> {
    return await db
      .select()
      .from(achievements)
      .where(eq(achievements.published, true))
      .orderBy(desc(achievements.date));
  }

  async getAllAchievements(): Promise<Achievement[]> {
    return await db
      .select()
      .from(achievements)
      .orderBy(desc(achievements.date));
  }

  async getAchievementById(id: string): Promise<Achievement | undefined> {
    const [achievement] = await db.select().from(achievements).where(eq(achievements.id, id));
    return achievement;
  }

  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const [newAchievement] = await db.insert(achievements).values(achievement).returning();
    return newAchievement;
  }

  async updateAchievement(id: string, achievement: Partial<InsertAchievement>): Promise<Achievement> {
    const [updatedAchievement] = await db
      .update(achievements)
      .set({ ...achievement, updatedAt: new Date() })
      .where(eq(achievements.id, id))
      .returning();
    return updatedAchievement;
  }

  async deleteAchievement(id: string): Promise<void> {
    await db.delete(achievements).where(eq(achievements.id, id));
  }

  async getComments(itemType: string, itemId: string): Promise<(Comment & { user: User; replies: Comment[] })[]> {
    const result = await db
      .select({
        comment: comments,
        user: users,
      })
      .from(comments)
      .leftJoin(users, eq(comments.userId, users.id))
      .where(and(eq(comments.itemType, itemType), eq(comments.itemId, itemId), eq(comments.parentId, null as any)))
      .orderBy(desc(comments.createdAt));

    const commentsWithReplies = [];
    for (const row of result) {
      const replies = await db
        .select({
          comment: comments,
          user: users,
        })
        .from(comments)
        .leftJoin(users, eq(comments.userId, users.id))
        .where(eq(comments.parentId, row.comment.id))
        .orderBy(comments.createdAt);

      commentsWithReplies.push({
        ...row.comment,
        user: row.user!,
        replies: replies.map(r => ({ ...r.comment, user: r.user! })),
      });
    }

    return commentsWithReplies as any;
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    const [newComment] = await db.insert(comments).values(comment).returning();
    return newComment;
  }

  async deleteComment(id: string): Promise<void> {
    await db.delete(comments).where(eq(comments.id, id));
  }

  async toggleLike(userId: string, itemType: string, itemId: string): Promise<{ liked: boolean; count: number }> {
    const existingLike = await db
      .select()
      .from(likes)
      .where(and(eq(likes.userId, userId), eq(likes.itemType, itemType), eq(likes.itemId, itemId)))
      .limit(1);

    if (existingLike.length > 0) {
      await db
        .delete(likes)
        .where(and(eq(likes.userId, userId), eq(likes.itemType, itemType), eq(likes.itemId, itemId)));
    } else {
      await db.insert(likes).values({ userId, itemType, itemId });
    }

    const count = await this.getLikeCount(itemType, itemId);
    return { liked: existingLike.length === 0, count };
  }

  async getLikeCount(itemType: string, itemId: string): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(likes)
      .where(and(eq(likes.itemType, itemType), eq(likes.itemId, itemId)));
    
    return Number(result[0]?.count || 0);
  }

  async getUserLike(userId: string, itemType: string, itemId: string): Promise<Like | undefined> {
    const [like] = await db
      .select()
      .from(likes)
      .where(and(eq(likes.userId, userId), eq(likes.itemType, itemType), eq(likes.itemId, itemId)))
      .limit(1);
    return like;
  }
}

export const storage = new DatabaseStorage();
