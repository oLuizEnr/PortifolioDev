#!/usr/bin/env python3
"""
Main entry point for the portfolio application
"""

from app import app

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)