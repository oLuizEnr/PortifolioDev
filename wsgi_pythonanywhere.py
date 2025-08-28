#!/usr/bin/env python3
"""
WSGI entry point para deploy no PythonAnywhere
Substitua 'yourusername' pelo seu nome de usuário do PythonAnywhere
"""

import sys
import os

# Adicione o caminho do projeto ao Python path
project_dir = '/home/yourusername/portfolio'  # ALTERE 'yourusername' para seu usuário
if project_dir not in sys.path:
    sys.path.insert(0, project_dir)

# Mude para o diretório do projeto
os.chdir(project_dir)

# Configure a variável de ambiente
os.environ['FLASK_ENV'] = 'pythonanywhere'
os.environ['PA_USERNAME'] = 'yourusername'  # ALTERE para seu usuário

# Garanta que os diretórios existam
os.makedirs('sessions', exist_ok=True)
os.makedirs('static', exist_ok=True)

# Importe a aplicação
from app import create_app

# Crie a aplicação para PythonAnywhere
application = create_app('pythonanywhere')

if __name__ == "__main__":
    application.run()