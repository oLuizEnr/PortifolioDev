#!/usr/bin/env python3
"""
Seed Data Script for Portfolio Application
Creates sample data for testing and demonstration purposes
"""

import os
import sys
from datetime import datetime, timezone, timedelta
from werkzeug.security import generate_password_hash

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app, db
from models import (User, Category, Tag, Project, Achievement, Comment, Like, 
                   SiteSettings, ProjectImage, project_tags)
from utils import create_slug, make_unique_slug


def create_owner_user():
    """Create the portfolio owner user"""
    print("Creating portfolio owner...")
    
    owner = User.query.filter_by(is_owner=True).first()
    if owner:
        print("Portfolio owner already exists.")
        return owner
    
    owner = User(
        username='portfolio_owner',
        email='owner@portfolio.com',
        first_name='João',
        last_name='Silva',
        bio='Desenvolvedor Full Stack apaixonado por tecnologia e inovação. '
            'Especialista em Python, JavaScript e desenvolvimento web moderno. '
            'Sempre buscando novos desafios e oportunidades de aprendizado.',
        is_owner=True,
        is_active=True,
        email_verified=True
    )
    owner.set_password('portfolio123')
    
    db.session.add(owner)
    db.session.commit()
    print(f"Portfolio owner created: {owner.username}")
    return owner


def create_sample_users():
    """Create sample users for testing comments and interactions"""
    print("Creating sample users...")
    
    sample_users_data = [
        {
            'username': 'maria_dev',
            'email': 'maria@exemplo.com',
            'first_name': 'Maria',
            'last_name': 'Santos',
            'bio': 'Desenvolvedora Frontend com foco em React e UX/UI.'
        },
        {
            'username': 'carlos_tech',
            'email': 'carlos@exemplo.com',
            'first_name': 'Carlos',
            'last_name': 'Oliveira',
            'bio': 'Engenheiro de Software e entusiasta de DevOps.'
        },
        {
            'username': 'ana_design',
            'email': 'ana@exemplo.com',
            'first_name': 'Ana',
            'last_name': 'Costa',
            'bio': 'Designer e desenvolvedora, criando experiências digitais incríveis.'
        }
    ]
    
    created_users = []
    for user_data in sample_users_data:
        existing_user = User.query.filter_by(email=user_data['email']).first()
        if not existing_user:
            user = User(**user_data)
            user.set_password('senha123')
            db.session.add(user)
            created_users.append(user)
            print(f"Created user: {user_data['username']}")
        else:
            created_users.append(existing_user)
            print(f"User already exists: {user_data['username']}")
    
    db.session.commit()
    return created_users


def create_categories():
    """Create project categories"""
    print("Creating categories...")
    
    categories_data = [
        {
            'name': 'Desenvolvimento Web',
            'description': 'Projetos de aplicações web fullstack e frontend',
            'slug': 'desenvolvimento-web'
        },
        {
            'name': 'APIs e Backend',
            'description': 'Desenvolvimento de APIs REST e sistemas backend',
            'slug': 'apis-backend'
        },
        {
            'name': 'Mobile',
            'description': 'Aplicações móveis e responsivas',
            'slug': 'mobile'
        },
        {
            'name': 'Data Science',
            'description': 'Projetos de análise de dados e machine learning',
            'slug': 'data-science'
        },
        {
            'name': 'Automação',
            'description': 'Scripts e ferramentas de automação',
            'slug': 'automacao'
        }
    ]
    
    created_categories = []
    for cat_data in categories_data:
        existing_cat = Category.query.filter_by(slug=cat_data['slug']).first()
        if not existing_cat:
            category = Category(**cat_data)
            db.session.add(category)
            created_categories.append(category)
            print(f"Created category: {cat_data['name']}")
        else:
            created_categories.append(existing_cat)
            print(f"Category already exists: {cat_data['name']}")
    
    db.session.commit()
    return created_categories


def create_tags():
    """Create project tags"""
    print("Creating tags...")
    
    tags_data = [
        'Python', 'JavaScript', 'React', 'Flask', 'Django', 'Node.js',
        'PostgreSQL', 'MongoDB', 'Docker', 'AWS', 'Git', 'HTML5',
        'CSS3', 'Bootstrap', 'API REST', 'Machine Learning', 'Data Analysis',
        'Web Scraping', 'Automation', 'Testing', 'CI/CD', 'Linux',
        'Vue.js', 'TypeScript', 'GraphQL', 'Redis', 'Elasticsearch'
    ]
    
    created_tags = []
    for tag_name in tags_data:
        slug = create_slug(tag_name)
        existing_tag = Tag.query.filter_by(slug=slug).first()
        if not existing_tag:
            tag = Tag(name=tag_name, slug=slug)
            db.session.add(tag)
            created_tags.append(tag)
            print(f"Created tag: {tag_name}")
        else:
            created_tags.append(existing_tag)
    
    db.session.commit()
    return created_tags


def create_projects(categories, tags):
    """Create sample projects"""
    print("Creating projects...")
    
    projects_data = [
        {
            'title': 'Sistema de Gestão de Portfólio',
            'description': 'Plataforma completa para criação e gerenciamento de portfólios digitais com sistema de comentários, curtidas e compartilhamento.',
            'content': '''Este projeto representa a evolução do portfólio tradicional para a era digital. 
            
Desenvolvido com Flask e PostgreSQL, o sistema oferece:

**Funcionalidades Principais:**
- Painel administrativo completo para gerenciamento de projetos
- Sistema de autenticação e autorização
- Upload e gerenciamento de imagens
- Sistema de comentários com moderação
- Integração com redes sociais para compartilhamento
- SEO otimizado com meta tags dinâmicas
- Design responsivo para todos os dispositivos

**Tecnologias Utilizadas:**
- Backend: Python, Flask, SQLAlchemy
- Frontend: HTML5, CSS3, JavaScript, Bootstrap 5
- Banco de Dados: PostgreSQL
- Infraestrutura: Docker, AWS

**Desafios e Soluções:**
O maior desafio foi criar uma interface intuitiva que atendesse tanto proprietários quanto visitantes. A solução foi implementar um sistema de permissões flexível e uma UX/UI focada na experiência do usuário.

**Resultados:**
- Interface 100% responsiva
- Tempo de carregamento otimizado
- Sistema de notificações em tempo real
- Integração completa com LinkedIn para networking profissional''',
            'category': 'Desenvolvimento Web',
            'tags': ['Python', 'Flask', 'PostgreSQL', 'Bootstrap', 'JavaScript'],
            'demo_url': 'https://portfolio-demo.herokuapp.com',
            'github_url': 'https://github.com/usuario/portfolio-system',
            'technologies': 'Python, Flask, PostgreSQL, Bootstrap, JavaScript, HTML5, CSS3',
            'status': 'published',
            'is_featured': True,
            'completion_date': datetime.now(timezone.utc) - timedelta(days=30),
            'meta_title': 'Sistema de Gestão de Portfólio - Projeto Full Stack',
            'meta_description': 'Sistema completo para criação de portfólios digitais com Flask e PostgreSQL'
        },
        {
            'title': 'API de Análise de Sentimentos',
            'description': 'API REST para análise de sentimentos em textos utilizando processamento de linguagem natural e machine learning.',
            'content': '''API robusta para análise de sentimentos desenvolvida com foco em performance e precisão.

**Objetivo:**
Criar uma solução escalável para análise de sentimentos que pudesse ser integrada em diferentes aplicações, desde redes sociais até sistemas de atendimento ao cliente.

**Funcionalidades:**
- Análise de sentimentos em tempo real
- Suporte a múltiplos idiomas (português, inglês, espanhol)
- API RESTful com documentação completa
- Sistema de cache para otimização
- Monitoramento e logs detalhados

**Arquitetura:**
- Microserviços com Docker
- Load balancer para alta disponibilidade
- Banco de dados Redis para cache
- Elasticsearch para logs e analytics

**Machine Learning:**
- Modelos treinados com datasets brasileiros
- Precisão de 94% em textos em português
- Atualização contínua dos modelos
- A/B testing para melhorias

**Impacto:**
A API foi adotada por 3 empresas locais, processando mais de 100k textos por mês e auxiliando na tomada de decisões baseadas em feedback de clientes.''',
            'category': 'APIs e Backend',
            'tags': ['Python', 'Machine Learning', 'API REST', 'Docker', 'Redis'],
            'demo_url': 'https://sentiment-api.herokuapp.com',
            'github_url': 'https://github.com/usuario/sentiment-api',
            'technologies': 'Python, scikit-learn, Flask, Redis, Docker, Elasticsearch',
            'status': 'published',
            'is_featured': True,
            'completion_date': datetime.now(timezone.utc) - timedelta(days=45),
            'meta_title': 'API de Análise de Sentimentos - Machine Learning',
            'meta_description': 'API REST para análise de sentimentos com ML e processamento de linguagem natural'
        },
        {
            'title': 'Dashboard Analytics em React',
            'description': 'Dashboard interativo para visualização de dados e métricas em tempo real com gráficos dinâmicos e filtros avançados.',
            'content': '''Dashboard moderno e interativo desenvolvido para atender a necessidade de visualização de dados complexos de forma intuitiva.

**Contexto:**
Desenvolvido para uma empresa de e-commerce que precisava monitorar KPIs em tempo real, desde vendas até comportamento de usuários.

**Características Técnicas:**
- Interface construída em React com TypeScript
- State management com Redux Toolkit
- Visualizações com Chart.js e D3.js
- WebSockets para atualizações em tempo real
- Design system próprio baseado no Material-UI

**Funcionalidades:**
- Múltiplos tipos de gráficos (linha, barra, pizza, scatter)
- Filtros por período, categoria e região
- Exportação de relatórios em PDF/Excel
- Alertas automáticos por email
- Modo offline com sincronização

**Performance:**
- Lazy loading de componentes
- Virtualização de listas grandes
- Cache inteligente de dados
- Otimização de re-renders

**Resultados Mensuráveis:**
- Redução de 60% no tempo de análise de dados
- Aumento de 40% na produtividade da equipe de vendas
- Interface responsiva utilizada em dispositivos móveis por 35% dos usuários''',
            'category': 'Desenvolvimento Web',
            'tags': ['React', 'TypeScript', 'JavaScript', 'Data Analysis', 'API REST'],
            'demo_url': 'https://dashboard-analytics.netlify.app',
            'github_url': 'https://github.com/usuario/dashboard-analytics',
            'technologies': 'React, TypeScript, Redux, Chart.js, Material-UI, WebSockets',
            'status': 'published',
            'is_featured': True,
            'completion_date': datetime.now(timezone.utc) - timedelta(days=60),
            'meta_title': 'Dashboard Analytics React - Visualização de Dados',
            'meta_description': 'Dashboard interativo em React para análise de dados e métricas em tempo real'
        },
        {
            'title': 'E-commerce Mobile App',
            'description': 'Aplicativo mobile híbrido para e-commerce com carrinho de compras, pagamento integrado e sistema de avaliações.',
            'content': '''Aplicativo mobile completo desenvolvido para modernizar a experiência de compra online de uma loja local.

**Desafio:**
Criar uma experiência mobile nativa mantendo a compatibilidade com múltiplas plataformas e integrando com sistemas legados.

**Solução Técnica:**
- React Native para desenvolvimento híbrido
- Integration com APIs REST existentes
- Estado global com Context API
- Navegação intuitiva com React Navigation
- Autenticação segura com JWT

**Funcionalidades Implementadas:**
- Catálogo de produtos com busca e filtros
- Carrinho de compras persistente
- Múltiplos métodos de pagamento (Pix, cartão, boleto)
- Sistema de avaliações e comentários
- Notificações push para promoções
- Rastreamento de pedidos em tempo real

**UX/UI Design:**
- Design system consistente
- Microinterações para melhor feedback
- Acessibilidade seguindo diretrizes WCAG
- Testes de usabilidade com usuários reais

**Tecnologias e Integrações:**
- React Native, Expo
- Stripe para pagamentos
- Firebase para notificações
- AsyncStorage para dados offline
- Integração com correios para frete

**Métricas de Sucesso:**
- 4.8/5 nas lojas de aplicativos
- 85% taxa de retenção no primeiro mês
- 250% aumento nas vendas mobile''',
            'category': 'Mobile',
            'tags': ['React', 'JavaScript', 'Mobile', 'API REST', 'Git'],
            'demo_url': None,
            'github_url': 'https://github.com/usuario/ecommerce-mobile',
            'technologies': 'React Native, Expo, Firebase, Stripe, AsyncStorage',
            'status': 'published',
            'is_featured': False,
            'completion_date': datetime.now(timezone.utc) - timedelta(days=90),
            'meta_title': 'E-commerce Mobile App - React Native',
            'meta_description': 'App mobile para e-commerce com React Native, pagamentos e notificações'
        },
        {
            'title': 'Automação de Web Scraping',
            'description': 'Sistema automatizado de coleta de dados web com monitoramento de preços e alertas inteligentes para e-commerce.',
            'content': '''Sistema robusto de web scraping desenvolvido para monitoramento competitivo de preços no setor de e-commerce.

**Problema Identificado:**
Necessidade de acompanhar preços de concorrentes em tempo real para manter competitividade no mercado.

**Arquitetura da Solução:**
- Web scraping distribuído com Scrapy e Selenium
- Sistema de filas com Celery e Redis
- Banco de dados PostgreSQL para armazenamento
- Dashboard web para visualização
- Sistema de alertas via email e Slack

**Desafios Técnicos Superados:**
- Bypass de proteções anti-bot
- Processamento de JavaScript com Selenium
- Gestão de proxies rotativos
- Tratamento de diferentes estruturas de sites
- Rate limiting e throttling inteligente

**Funcionalidades Avançadas:**
- Detecção automática de mudanças de preço
- Análise de tendências com gráficos históricos
- Alertas configuráveis por produto/categoria
- Exportação de relatórios automatizada
- API REST para integração com outros sistemas

**Tecnologias Utilizadas:**
- Python, Scrapy, Selenium, BeautifulSoup
- PostgreSQL, Redis, Celery
- Flask para dashboard web
- Docker para containerização
- Cron jobs para agendamento

**Resultados Obtidos:**
- Monitoramento de 50+ sites concorrentes
- Processamento de 10k+ produtos diariamente
- Redução de 70% no tempo de pesquisa manual
- ROI positivo em 3 meses de operação''',
            'category': 'Automação',
            'tags': ['Python', 'Web Scraping', 'Automation', 'PostgreSQL', 'API REST'],
            'demo_url': None,
            'github_url': 'https://github.com/usuario/web-scraping-automation',
            'technologies': 'Python, Scrapy, Selenium, PostgreSQL, Redis, Celery, Flask',
            'status': 'published',
            'is_featured': False,
            'completion_date': datetime.now(timezone.utc) - timedelta(days=120),
            'meta_title': 'Automação Web Scraping - Monitoramento de Preços',
            'meta_description': 'Sistema automatizado de web scraping para monitoramento de preços e coleta de dados'
        },
        {
            'title': 'Plataforma de Cursos Online',
            'description': 'Sistema completo de EAD com streaming de vídeo, exercícios interativos e certificação digital.',
            'content': '''Plataforma educacional desenvolvida durante a pandemia para democratizar o acesso à educação de qualidade.

**Visão do Projeto:**
Criar uma plataforma que combinasse a qualidade técnica com uma experiência de aprendizado envolvente e acessível.

**Funcionalidades Educacionais:**
- Sistema de cursos com módulos e aulas
- Player de vídeo personalizado com marcadores
- Exercícios interativos com correção automática
- Fórum de discussão por curso
- Sistema de certificação digital
- Progresso de aprendizado gamificado

**Tecnologias de Streaming:**
- Encoding automático de vídeos
- CDN para distribuição global
- Adaptive bitrate streaming
- Proteção contra download não autorizado
- Subtítulas automáticas com IA

**Backend Robusto:**
- Django REST Framework
- Celery para processamento assíncrono
- PostgreSQL com otimizações avançadas
- Redis para cache e sessões
- AWS S3 para armazenamento de mídia

**Frontend Moderno:**
- Vue.js 3 com Composition API
- Vuex para gerenciamento de estado
- Design responsivo mobile-first
- PWA com funcionamento offline
- Acessibilidade WCAG AAA

**Segurança e Performance:**
- Autenticação JWT com refresh tokens
- Rate limiting e proteção DDoS
- Criptografia end-to-end para conteúdo premium
- Compressão e minificação automática
- Monitoring com Prometheus e Grafana

**Impacto Social:**
- 5000+ alunos ativos
- 95% taxa de satisfação
- 80% taxa de conclusão dos cursos
- Parcerias com 10 instituições de ensino''',
            'category': 'Desenvolvimento Web',
            'tags': ['Django', 'Vue.js', 'Python', 'JavaScript', 'AWS'],
            'demo_url': 'https://plataforma-ead.herokuapp.com',
            'github_url': 'https://github.com/usuario/plataforma-ead',
            'technologies': 'Django, Vue.js, PostgreSQL, Redis, AWS, Celery',
            'status': 'published',
            'is_featured': False,
            'completion_date': datetime.now(timezone.utc) - timedelta(days=150),
            'meta_title': 'Plataforma EAD - Sistema de Cursos Online',
            'meta_description': 'Plataforma completa de ensino a distância com streaming, exercícios e certificação'
        }
    ]
    
    created_projects = []
    for proj_data in projects_data:
        # Check if project already exists
        slug = create_slug(proj_data['title'])
        existing_project = Project.query.filter_by(slug=slug).first()
        if existing_project:
            print(f"Project already exists: {proj_data['title']}")
            created_projects.append(existing_project)
            continue
        
        # Find category
        category = None
        if proj_data['category']:
            category = Category.query.filter_by(name=proj_data['category']).first()
        
        # Create project
        project = Project(
            title=proj_data['title'],
            slug=make_unique_slug(Project, 'slug', slug),
            description=proj_data['description'],
            content=proj_data['content'],
            category_id=category.id if category else None,
            demo_url=proj_data['demo_url'],
            github_url=proj_data['github_url'],
            technologies=proj_data['technologies'],
            status=proj_data['status'],
            is_featured=proj_data['is_featured'],
            completion_date=proj_data['completion_date'],
            meta_title=proj_data['meta_title'],
            meta_description=proj_data['meta_description'],
            published_at=datetime.now(timezone.utc) if proj_data['status'] == 'published' else None,
            views_count=0,
            likes_count=0,
            comments_count=0
        )
        
        db.session.add(project)
        db.session.flush()  # Get project ID
        
        # Add tags
        project_tag_names = proj_data['tags']
        for tag_name in project_tag_names:
            tag = next((t for t in tags if t.name == tag_name), None)
            if tag:
                project.tags.append(tag)
        
        created_projects.append(project)
        print(f"Created project: {proj_data['title']}")
    
    db.session.commit()
    return created_projects


def create_achievements():
    """Create sample achievements"""
    print("Creating achievements...")
    
    achievements_data = [
        {
            'title': 'Certificação AWS Solutions Architect',
            'description': 'Certificação oficial da Amazon Web Services para arquitetura de soluções em nuvem, validando conhecimentos em design de sistemas distribuídos, segurança e otimização de custos.',
            'organization': 'Amazon Web Services',
            'date_achieved': datetime.now(timezone.utc) - timedelta(days=60),
            'certificate_url': 'https://aws.amazon.com/certification/verify',
            'status': 'published',
            'is_featured': True
        },
        {
            'title': 'Hackathon Regional - 1º Lugar',
            'description': 'Primeiro lugar no hackathon regional de inovação tecnológica com projeto de IA para agricultura sustentável. Solução desenvolvida em 48 horas com equipe multidisciplinar.',
            'organization': 'TechHub Regional',
            'date_achieved': datetime.now(timezone.utc) - timedelta(days=90),
            'certificate_url': None,
            'status': 'published',
            'is_featured': True
        },
        {
            'title': 'Especialização em Machine Learning',
            'description': 'Curso avançado de 120 horas em Machine Learning e Deep Learning, incluindo projetos práticos com TensorFlow, PyTorch e implementação de modelos de produção.',
            'organization': 'Coursera - Stanford University',
            'date_achieved': datetime.now(timezone.utc) - timedelta(days=120),
            'certificate_url': 'https://coursera.org/verify/specialization',
            'status': 'published',
            'is_featured': True
        },
        {
            'title': 'Contribuidor Open Source',
            'description': 'Contribuições aceitas em projetos open source populares incluindo Flask, Django e React. Mais de 100 commits aceitos e reconhecimento da comunidade.',
            'organization': 'GitHub Community',
            'date_achieved': datetime.now(timezone.utc) - timedelta(days=30),
            'certificate_url': 'https://github.com/usuario',
            'status': 'published',
            'is_featured': False
        },
        {
            'title': 'Palestra TechConf 2023',
            'description': 'Palestra sobre "Microserviços com Python" na principal conferência de tecnologia da região, com mais de 300 participantes e feedback positivo.',
            'organization': 'TechConf Brazil',
            'date_achieved': datetime.now(timezone.utc) - timedelta(days=180),
            'certificate_url': None,
            'status': 'published',
            'is_featured': False
        }
    ]
    
    created_achievements = []
    for ach_data in achievements_data:
        existing_achievement = Achievement.query.filter_by(title=ach_data['title']).first()
        if not existing_achievement:
            achievement = Achievement(**ach_data)
            db.session.add(achievement)
            created_achievements.append(achievement)
            print(f"Created achievement: {ach_data['title']}")
        else:
            created_achievements.append(existing_achievement)
            print(f"Achievement already exists: {ach_data['title']}")
    
    db.session.commit()
    return created_achievements


def create_comments_and_likes(projects, users):
    """Create sample comments and likes"""
    print("Creating comments and likes...")
    
    comments_data = [
        {
            'project_title': 'Sistema de Gestão de Portfólio',
            'user_email': 'maria@exemplo.com',
            'content': 'Projeto incrível! A interface está muito intuitiva e o sistema de comentários funciona perfeitamente. Parabéns pelo trabalho!'
        },
        {
            'project_title': 'Sistema de Gestão de Portfólio',
            'user_email': 'carlos@exemplo.com',
            'content': 'Impressionante a qualidade do código e a documentação. Vai ser muito útil como referência para meus projetos.'
        },
        {
            'project_title': 'API de Análise de Sentimentos',
            'user_email': 'ana@exemplo.com',
            'content': 'Que projeto fantástico! A precisão de 94% é realmente impressionante. Como você treinou o modelo para português?'
        },
        {
            'project_title': 'API de Análise de Sentimentos',
            'user_email': 'maria@exemplo.com',
            'content': 'Adorei a documentação da API! Muito clara e com exemplos práticos. Já estou testando em um projeto pessoal.'
        },
        {
            'project_title': 'Dashboard Analytics em React',
            'user_email': 'carlos@exemplo.com',
            'content': 'O design está muito moderno e os gráficos são super informativos. TypeScript + React é uma combinação poderosa!'
        },
        {
            'project_title': 'E-commerce Mobile App',
            'user_email': 'ana@exemplo.com',
            'content': 'React Native está cada vez melhor! O app ficou muito fluido e a UX está excelente. Parabéns!'
        }
    ]
    
    # Create comments
    for comment_data in comments_data:
        project = Project.query.filter_by(title=comment_data['project_title']).first()
        user = User.query.filter_by(email=comment_data['user_email']).first()
        
        if project and user:
            existing_comment = Comment.query.filter_by(
                project_id=project.id, 
                user_id=user.id,
                content=comment_data['content']
            ).first()
            
            if not existing_comment:
                comment = Comment(
                    content=comment_data['content'],
                    user_id=user.id,
                    project_id=project.id,
                    is_approved=True
                )
                db.session.add(comment)
                
                # Update project comment count
                project.comments_count = (project.comments_count or 0) + 1
                
                print(f"Created comment for {project.title} by {user.username}")
    
    # Create likes (each user likes different projects)
    like_patterns = [
        ('maria@exemplo.com', ['Sistema de Gestão de Portfólio', 'API de Análise de Sentimentos', 'Dashboard Analytics em React']),
        ('carlos@exemplo.com', ['Sistema de Gestão de Portfólio', 'Dashboard Analytics em React', 'E-commerce Mobile App']),
        ('ana@exemplo.com', ['API de Análise de Sentimentos', 'E-commerce Mobile App', 'Automação de Web Scraping'])
    ]
    
    for user_email, project_titles in like_patterns:
        user = User.query.filter_by(email=user_email).first()
        if user:
            for project_title in project_titles:
                project = Project.query.filter_by(title=project_title).first()
                if project:
                    existing_like = Like.query.filter_by(user_id=user.id, project_id=project.id).first()
                    if not existing_like:
                        like = Like(user_id=user.id, project_id=project.id)
                        db.session.add(like)
                        
                        # Update project like count
                        project.likes_count = (project.likes_count or 0) + 1
                        
                        print(f"Created like for {project.title} by {user.username}")
    
    # Add some random views to projects
    for project in projects:
        if project.views_count == 0:
            import random
            project.views_count = random.randint(50, 500)
    
    db.session.commit()


def create_site_settings():
    """Create or update site settings"""
    print("Creating site settings...")
    
    settings = SiteSettings.query.first()
    if not settings:
        settings = SiteSettings()
        db.session.add(settings)
    
    settings.site_title = 'João Silva - Desenvolvedor Full Stack'
    settings.site_description = 'Portfólio digital de João Silva, desenvolvedor full stack especializado em Python, JavaScript e tecnologias web modernas.'
    settings.owner_name = 'João Silva'
    settings.owner_title = 'Desenvolvedor Full Stack & Consultor em Tecnologia'
    settings.owner_bio = '''Desenvolvedor full stack apaixonado por tecnologia e inovação, com mais de 5 anos de experiência criando soluções digitais impactantes.

Especializo-me em desenvolvimento web moderno usando Python (Flask/Django), JavaScript (React/Vue.js) e tecnologias de nuvem (AWS). Tenho experiência comprovada em projetos que vão desde APIs robustas até interfaces de usuário intuitivas.

Minha abordagem combina excelência técnica com foco na experiência do usuário, sempre buscando soluções elegantes para problemas complexos. Acredito no poder da tecnologia para transformar negócios e melhorar vidas.

Quando não estou codificando, contribuo para projetos open source, mentoro desenvolvedores iniciantes e estudo as últimas tendências em machine learning e inteligência artificial.'''
    settings.owner_email = 'joao@exemplo.com'
    settings.owner_phone = '+55 (11) 99999-9999'
    settings.owner_location = 'São Paulo, SP - Brasil'
    settings.linkedin_url = 'https://linkedin.com/in/joaosilva'
    settings.github_url = 'https://github.com/joaosilva'
    settings.twitter_url = 'https://twitter.com/joaosilva_dev'
    settings.meta_keywords = 'desenvolvedor, full stack, python, javascript, react, flask, django, portfolio, programador, são paulo'
    settings.google_analytics_id = 'G-XXXXXXXXXX'
    
    db.session.commit()
    print("Site settings created/updated")


def main():
    """Main function to create all seed data"""
    print("Starting seed data creation...")
    print("=" * 50)
    
    with app.app_context():
        try:
            # Create all tables
            db.create_all()
            print("Database tables created")
            
            # Create data in order of dependencies
            owner = create_owner_user()
            users = create_sample_users()
            categories = create_categories()
            tags = create_tags()
            projects = create_projects(categories, tags)
            achievements = create_achievements()
            create_comments_and_likes(projects, users)
            create_site_settings()
            
            print("=" * 50)
            print("Seed data creation completed successfully!")
            print("\nSummary:")
            print(f"- Users created: {len(users) + 1}")
            print(f"- Categories created: {len(categories)}")
            print(f"- Tags created: {len(tags)}")
            print(f"- Projects created: {len(projects)}")
            print(f"- Achievements created: {len(achievements)}")
            print(f"- Comments and likes added")
            print(f"- Site settings configured")
            
            print("\nLogin credentials:")
            print("Portfolio Owner:")
            print("  Username: portfolio_owner")
            print("  Password: portfolio123")
            print("\nSample Users:")
            print("  Username: maria_dev / Password: senha123")
            print("  Username: carlos_tech / Password: senha123")
            print("  Username: ana_design / Password: senha123")
            
        except Exception as e:
            print(f"Error creating seed data: {str(e)}")
            db.session.rollback()
            raise


if __name__ == '__main__':
    main()
