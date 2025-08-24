# Configuração para PythonAnywhere

Este guia explica como hospedar seu portfólio Python no PythonAnywhere.

## Pré-requisitos

1. Conta no PythonAnywhere
2. Frontend React já buildado (pasta `client/dist/`)

## Passos para Deploy

### 1. Upload dos arquivos

Faça upload de todos os arquivos da pasta `python_server/` para sua conta PythonAnywhere, incluindo:
- `app.py`
- `models.py`  
- `admin_routes.py`
- `wsgi.py`
- `requirements.txt`
- `portfolio.db` (banco de dados migrado)

### 2. Configurar ambiente virtual

No console do PythonAnywhere:

```bash
# Criar ambiente virtual
mkvirtualenv --python=/usr/bin/python3.10 portfolio

# Instalar dependências
pip install -r requirements.txt
```

### 3. Configurar Web App

1. Vá para a aba "Web" no dashboard
2. Clique em "Add a new web app"
3. Escolha "Manual configuration" (não use o wizard Flask)
4. Escolha Python 3.10
5. Configure os seguintes caminhos:

**Source code:** `/home/seuusername/portfolio/`
**Working directory:** `/home/seuusername/portfolio/python_server/`
**WSGI configuration file:** `/home/seuusername/portfolio/python_server/wsgi.py`

### 4. Editar arquivo WSGI

Atualize o arquivo `wsgi.py` com o caminho correto:

```python
project_dir = '/home/seuusername/portfolio'  # Substitua 'seuusername' pelo seu username
```

### 5. Configurar arquivos estáticos

Na seção "Static files":

**URL:** `/static/`  
**Directory:** `/home/seuusername/portfolio/client/dist/`

**URL:** `/uploads/`  
**Directory:** `/home/seuusername/portfolio/uploads/`

### 6. Configurar diretório uploads

```bash
mkdir /home/seuusername/portfolio/uploads
chmod 755 /home/seuusername/portfolio/uploads
```

### 7. Atualizar configurações de segurança

No arquivo `app.py`, altere:
- `app.config['SECRET_KEY']` para uma chave segura
- Credenciais de admin padrão

### 8. Reload da aplicação

Clique em "Reload" na aba Web para aplicar as mudanças.

## URLs de acesso

- **Frontend:** `https://seuusername.pythonanywhere.com/`
- **API:** `https://seuusername.pythonanywhere.com/api/`
- **Admin:** Faça login em `https://seuusername.pythonanywhere.com/` com as credenciais de admin

## Funcionalidades disponíveis

✅ Visualização do portfólio  
✅ Login/logout de admin  
✅ CRUD de projetos, experiências e conquistas  
✅ Sistema de comentários e likes  
✅ Upload de imagens  
✅ Formulário de contato  

## Credenciais padrão

**Email:** admin@example.com  
**Senha:** admin123  

⚠️ **IMPORTANTE:** Altere essas credenciais em produção!

## Troubleshooting

1. **Erro 500:** Verifique os logs de erro na aba "Web"
2. **Banco não encontrado:** Certifique-se que `portfolio.db` está no diretório correto
3. **Uploads não funcionam:** Verifique permissões da pasta uploads