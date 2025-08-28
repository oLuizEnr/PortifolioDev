#!/usr/bin/env python3
"""
Script para executar a aplicação localmente em desenvolvimento
"""

import os
from app import create_app

if __name__ == '__main__':
    # Configurar para desenvolvimento local
    os.environ['FLASK_ENV'] = 'development'
    
    # Criar aplicação
    app = create_app('development')
    
    print("🚀 Iniciando servidor de desenvolvimento...")
    print("📱 Frontend: http://localhost:5000")
    print("🔧 Admin: admin@example.com / admin123")
    
    # Executar com hot reload
    app.run(host='0.0.0.0', port=5000, debug=True, use_reloader=True)