# Digital Portfolio System

## Overview

This is a comprehensive digital portfolio application built as a full-stack TypeScript solution. The system allows developers to showcase their professional work through an interactive portfolio with both public-facing content and administrative capabilities. The application features a modern tech stack with React frontend, Express backend, PostgreSQL database, and includes social interaction features like commenting and liking.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript running on Vite for development
- **UI Library**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Authentication**: Session-based authentication with protected routes

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Session Management**: Express sessions with PostgreSQL storage using connect-pg-simple
- **File Handling**: Multer for file uploads with image validation and size limits
- **Authentication Strategy**: Replit Auth integration using OpenID Connect (OIDC)

### Database Design
- **Primary Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon serverless PostgreSQL with connection pooling
- **Schema Architecture**: 
  - Users table with admin role support and Replit Auth integration
  - Projects, experiences, and achievements tables with publish/draft states
  - Comments system with nested replies support
  - Likes system with user tracking
  - Sessions table for authentication persistence

### Authentication & Authorization
- **Authentication Provider**: Replit Auth with OIDC protocol
- **Session Storage**: Server-side sessions stored in PostgreSQL
- **Authorization Levels**: 
  - Public users (view-only access)
  - Authenticated users (can comment and like)
  - Admin users (full CRUD operations)
- **Security Features**: CSRF protection, secure cookies, and input validation

### Content Management System
- **Portfolio Items**: Projects, professional experiences, and achievements
- **Content States**: Published/unpublished toggle for draft management
- **Media Handling**: Image upload with validation and storage
- **SEO Features**: Featured content highlighting and social sharing capabilities

## External Dependencies

### Database & Storage
- **Neon PostgreSQL**: Serverless PostgreSQL database with WebSocket support
- **Drizzle Kit**: Database migrations and schema management

### Authentication Services
- **Replit Auth**: Primary authentication provider using OIDC
- **OpenID Client**: OIDC client library for Replit integration

### Development & Build Tools
- **Vite**: Frontend build tool with HMR and development server
- **ESBuild**: Backend bundling for production deployment
- **TypeScript Compiler**: Type checking and compilation
- **Tailwind CSS**: Utility-first CSS framework

### UI & Component Libraries
- **Radix UI**: Headless UI component primitives
- **Lucide React**: Icon library for consistent iconography
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation for API endpoints

### Deployment & Runtime
- **Replit**: Primary deployment platform with integrated development environment
- **Express Session**: Session middleware with PostgreSQL persistence
- **Multer**: File upload middleware for image handling