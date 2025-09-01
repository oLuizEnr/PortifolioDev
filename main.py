# -*- coding: utf-8 -*-
#!/usr/bin/env python3
"""
Main entry point for the portfolio application
"""
import os
import sys

# Force UTF-8 encoding
os.environ['PYTHONIOENCODING'] = 'utf-8'
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

from app import app

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)