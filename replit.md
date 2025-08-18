# Overview

This is a comprehensive digital portfolio web application built with Flask for showcasing projects, achievements, and professional information. The system is designed for a single portfolio owner who can manage their content through an admin interface, while visitors can view, like, comment, and share projects. The application features a modern responsive design with dark mode support and LinkedIn integration for social sharing.

# User Preferences

Preferred communication style: Simple, everyday language.

# Admin Credentials

Portfolio Owner: Luiz Enrique
- Username: luiz@teste
- Password: Admin123!

# System Architecture

## Backend Architecture
- **Framework**: Flask web framework with SQLAlchemy ORM for database operations
- **Database**: SQLAlchemy with support for PostgreSQL (configurable via DATABASE_URL)
- **Authentication**: Flask-Login for session management with user authentication and authorization
- **Security**: Flask-WTF with CSRF protection and secure password hashing using Werkzeug
- **Email**: Flask-Mail integration for password reset and notification emails
- **File Handling**: Custom utility functions for image upload, resizing with PIL, and secure file management

## Frontend Architecture
- **Template Engine**: Jinja2 templates with a base template system for consistent layout
- **Styling**: Bootstrap 5 with dark mode support and custom CSS for portfolio-specific styling
- **JavaScript**: Vanilla JavaScript for interactive features including dark mode toggle, form validation, and UI enhancements
- **Responsive Design**: Mobile-first approach with responsive navigation and card-based layout
- **Icons**: Font Awesome for consistent iconography throughout the application

## Data Models
- **User Management**: User model with roles (owner vs visitors), profile information, and authentication fields
- **Content Models**: Project, Achievement, Category, Tag models with many-to-many relationships
- **Interaction Models**: Comment and Like models for user engagement
- **Settings Model**: SiteSettings for configurable portfolio information and metadata
- **File Management**: ProjectImage model for handling multiple images per project

## Authorization System
- **Role-based Access**: Portfolio owner has admin privileges for content management
- **Guest Access**: Visitors can view content, register accounts for commenting and liking
- **Protected Routes**: Admin routes protected with owner-only access decorators
- **Session Management**: Remember me functionality and secure session handling

## File Upload System
- **Image Processing**: Automatic image resizing and optimization using PIL
- **Secure Storage**: Files stored in static/uploads with secure filename generation
- **Multiple Formats**: Support for various image formats with validation
- **Cleanup**: Automatic file deletion when content is removed

# External Dependencies

## Third-party Services
- **LinkedIn API**: Integration for social sharing with custom preview generation
- **Email Service**: SMTP configuration for transactional emails (password reset, notifications)
- **Database**: PostgreSQL database service for production deployment

## Frontend Libraries
- **Bootstrap 5**: UI framework with dark theme support
- **Font Awesome**: Icon library for consistent visual elements
- **PIL (Pillow)**: Python imaging library for image processing and optimization

## Development Tools
- **Flask Extensions**: Flask-SQLAlchemy, Flask-Login, Flask-Mail, Flask-WTF for core functionality
- **Security**: Werkzeug for password hashing and secure utilities
- **Validation**: WTForms for form handling and validation
- **Environment**: Environment variable configuration for sensitive data and deployment settings