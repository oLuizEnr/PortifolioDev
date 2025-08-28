# 📋 Instruções de Instalação e Deploy

## 🚀 Execução Local (Desenvolvimento)

### 1. Pré-requisitos
- Python 3.8+ instalado
- Node.js 16+ (para build do frontend)

### 2. Instalação Local

```bash
# Clone o repositório (se ainda não estiver local)
git clone <seu-repositorio>
cd portfolio

# Instale as dependências Python
pip install -r requirements_local.txt

# Instale as dependências Node.js para build do frontend
npm install

# Faça o build do frontend
npm run build

# Execute a aplicação
python run_local.py
```

### 3. Acesso Local
- **Frontend**: http://localhost:5000
- **Admin**: admin@example.com / admin123

---

## 🌐 Deploy no PythonAnywhere

### 1. Upload dos Arquivos
1. Faça upload de todos os arquivos para `/home/yourusername/portfolio`
2. Substitua `yourusername` pelo seu nome de usuário

### 2. Configuração no PythonAnywhere

#### A. Instalar Dependências
```bash
# Abra o console Bash no PythonAnywhere
cd ~/portfolio
pip install --user -r requirements.txt
```

#### B. Build do Frontend
```bash
# Se Node.js estiver disponível
npm install
npm run build
```

#### C. Configurar Web App
1. Na aba **Web** do PythonAnywhere:
   - Source code: `/home/yourusername/portfolio`
   - WSGI configuration file: `/home/yourusername/portfolio/wsgi_pythonanywhere.py`

#### D. Editar WSGI
Edite o arquivo `wsgi_pythonanywhere.py` e substitua `yourusername` pelo seu nome de usuário real.

#### E. Configurar Static Files
Na seção **Static files** da aba Web:
- URL: `/static/`
- Path: `/home/yourusername/portfolio/static/`

### 3. Banco de Dados (Opcional - MySQL)
Se quiser usar MySQL em vez de SQLite:

```python
# Em config.py, na classe PythonAnywhereConfig
SQLALCHEMY_DATABASE_URI = 'mysql://username:password@hostname/database_name'
```

### 4. Variáveis de Ambiente
Edite o arquivo `wsgi_pythonanywhere.py` para definir variáveis necessárias.

---

## 📁 Estrutura do Projeto

```
portfolio/
├── app.py              # Aplicação principal
├── config.py           # Configurações
├── models.py           # Modelos do banco de dados
├── run_local.py        # Script para execução local
├── wsgi_pythonanywhere.py  # WSGI para PythonAnywhere
├── requirements.txt    # Dependências principais
├── requirements_local.txt  # Dependências para desenvolvimento
├── admin_routes.py     # Rotas administrativas
├── upload_service.py   # Serviço de upload
├── client/            # Frontend React
├── dist/public/       # Frontend compilado
├── static/            # Arquivos estáticos
├── sessions/          # Sessões da aplicação
└── data/             # Banco de dados (desenvolvimento)
```

---

## 🔧 Solução de Problemas

### Problema: "Not Found" na página inicial
**Solução**: Certifique-se de que o frontend foi compilado (`npm run build`)

### Problema: Erro de dependências
**Solução**: Execute `pip install -r requirements.txt`

### Problema: Erro de permissões no PythonAnywhere
**Solução**: Use `pip install --user` para instalar dependências

### Problema: Static files não carregam
**Solução**: Configure corretamente a seção Static files na aba Web

---

## 📞 Suporte

Para problemas específicos:
1. Verifique os logs de erro no console
2. Certifique-se de que todas as dependências estão instaladas
3. Verifique se os caminhos estão corretos para seu ambiente