#!/usr/bin/env python3
"""
Main entry point for the portfolio application
"""

import sys
import os

# Add the python_server directory to Python path
python_server_dir = os.path.join(os.path.dirname(__file__), 'python_server')
if python_server_dir not in sys.path:
    sys.path.insert(0, python_server_dir)

# Change to the python_server directory for relative imports
original_dir = os.getcwd()
os.chdir(python_server_dir)

from app import app

# Change back to original directory so relative paths work correctly
os.chdir(original_dir)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)