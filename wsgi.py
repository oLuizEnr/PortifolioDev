#!/usr/bin/env python3
"""
WSGI entry point for PythonAnywhere deployment
"""

import sys
import os

# Add the project directory to Python path
project_dir = '/home/yourusername/portfolio'  # Update 'yourusername' with your PythonAnywhere username
if project_dir not in sys.path:
    sys.path.insert(0, project_dir)

# Change to the project directory
os.chdir(project_dir)

# Ensure sessions directory exists
os.makedirs('sessions', exist_ok=True)
os.makedirs('static', exist_ok=True)

from app import app as application

if __name__ == "__main__":
    application.run()