# Deploy no PythonAnywhere - Portfólio Digital

Este projeto está estruturado para deploy direto no PythonAnywhere.

## Estrutura do Projeto

```
portfolio/
├── app.py                 # Aplicação Flask principal
├── models.py             # Modelos do banco de dados
├── admin_routes.py       # Rotas administrativas
├── upload_service.py     # Serviço de upload de arquivos
├── wsgi.py              # Entry point para produção
├── main.py              # Entry point para desenvolvimento
├── requirements.txt     # Dependências Python
├── dist/public/         # Frontend React buildado
├── static/              # Arquivos enviados pelos usuários
└── database.db          # Banco de dados SQLite (para desenvolvimento)
```

## Passos para Deploy no PythonAnywhere

### 1. Upload dos Arquivos
Faça upload de todos os arquivos para sua conta PythonAnywhere:
- Todos os arquivos `.py` da raiz
- Pasta `dist/public/` (frontend buildado)
- Pasta `static/` (uploads de usuários)
- `requirements.txt`

### 2. Configurar Ambiente Virtual
No console do PythonAnywhere:

```bash
# Criar ambiente virtual
mkvirtualenv --python=/usr/bin/python3.10 portfolio

# Ativar ambiente
workon portfolio

# Instalar dependências
pip install -r requirements.txt
```

### 3. Configurar Web App
1. Vá para a aba "Web" no dashboard
2. Clique em "Add a new web app"
3. Escolha "Manual configuration"
4. Selecione Python 3.10
5. Configure:

**Source code:** `/home/yourusername/portfolio/`
**Working directory:** `/home/yourusername/portfolio/`
**WSGI configuration file:** `/home/yourusername/portfolio/wsgi.py`

### 4. Editar arquivo WSGI
Atualize `wsgi.py` com seu username:

```python
project_dir = '/home/SEUUSERNAME/portfolio'  # Substitua SEUUSERNAME
```

### 5. Configurar Arquivos Estáticos
Na seção "Static files" do dashboard:

**URL:** `/assets/`  
**Directory:** `/home/yourusername/portfolio/dist/public/assets/`

**URL:** `/static/`  
**Directory:** `/home/yourusername/portfolio/static/`

### 6. Configurações de Segurança
Antes do deploy, atualize no `app.py`:

```python
app.config['SECRET_KEY'] = 'sua-chave-secreta-muito-forte-aqui'
```

E altere as credenciais de admin padrão (admin@example.com / admin123).

### 7. Banco de Dados
O projeto usa SQLite por padrão. Para PostgreSQL no PythonAnywhere:

1. Crie um banco PostgreSQL na aba "Databases"
2. Atualize a `DATABASE_URL` no `app.py`:

```python
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://username:password@hostname/database'
```

### 8. Reload e Teste
1. Clique em "Reload" na aba Web
2. Acesse `https://yourusername.pythonanywhere.com/`

## URLs Importantes

- **Homepage:** `https://yourusername.pythonanywhere.com/`
- **API:** `https://yourusername.pythonanywhere.com/api/`
- **Admin:** Login na homepage com credenciais de admin

## Funcionalidades

✅ Visualização do portfólio  
✅ Sistema de login/logout  
✅ Painel administrativo  
✅ CRUD de projetos, experiências e conquistas  
✅ Sistema de comentários e likes  
✅ Upload de imagens  
✅ Formulário de contato  

## Credenciais Padrão

**Email:** admin@example.com  
**Senha:** admin123

⚠️ **IMPORTANTE:** Altere essas credenciais em produção!

## Troubleshooting

1. **Erro 500:** Verifique os logs na aba "Web" → "Error log"
2. **Arquivos estáticos não carregam:** Verifique as configurações de Static files
3. **Upload não funciona:** Verifique permissões da pasta `static/`