# Portfolio Digital Interativo

Um portfólio digital moderno e completo com painel administrativo, sistema de autenticação, upload de arquivos e integração com LinkedIn.

## 🚀 Tecnologias Utilizadas

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, TypeScript
- **Banco de Dados**: SQLite (local)
- **Autenticação**: Sistema próprio com sessões
- **Upload**: Sistema de arquivos local
- **ORM**: Drizzle ORM

## 📋 Pré-requisitos

- Node.js 18+ ou 20+
- NPM ou Yarn

## 🛠️ Instalação e Configuração

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar banco de dados
```bash
# Criar tabelas do SQLite
npx tsx server/migrate.ts
```

### 3. Iniciar o servidor
```bash
# Modo desenvolvimento
npm run dev

# O servidor estará disponível em: http://localhost:5000
```

## 🔑 Acesso Administrativo

### Usuário padrão criado automaticamente:
- **Email**: `teste@teste`
- **Senha**: `01234567`

### Funcionalidades Admin:
- ✅ Criar/editar projetos
- ✅ Criar/editar experiências
- ✅ Criar/editar conquistas
- ✅ Upload de imagens e GIFs
- ✅ Configurar URL do LinkedIn
- ✅ Gerenciar perfil

## 📁 Estrutura do Projeto

```
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── hooks/        # Custom hooks
│   │   ├── lib/          # Utilitários
│   │   └── pages/        # Páginas da aplicação
├── server/                # Backend Express
│   ├── auth.ts           # Sistema de autenticação
│   ├── db.ts            # Configuração do banco
│   ├── routes.ts        # Rotas da API
│   ├── storage.ts       # Operações do banco
│   ├── upload.ts        # Sistema de upload
│   └── migrate.ts       # Script de migração
├── shared/                # Código compartilhado
│   └── schema.ts         # Schema do banco de dados
├── data/                  # Banco de dados SQLite
└── uploads/              # Arquivos enviados
```

## 🎯 Como Usar

### 1. Acesso ao Portfólio
- Abra `http://localhost:5000` no navegador
- Visualize os projetos, experiências e conquistas

### 2. Acesso Administrativo
- Faça login com as credenciais padrão
- Acesse o painel admin clicando no ícone de usuário

### 3. Gerenciar Conteúdo
- **Projetos**: Adicione título, descrição, imagens, links GitHub/Live, tecnologias
- **Experiências**: Cadastre posições, empresas, períodos, descrições
- **Conquistas**: Registre certificações, prêmios, eventos

### 4. Upload de Arquivos
- Acesse a aba "Upload" no painel admin
- Envie imagens (JPEG, PNG, GIF, WebP) até 10MB
- Use as URLs geradas nos projetos e perfil

### 5. Configurar LinkedIn
- Acesse a aba "Perfil" no painel admin
- Adicione sua URL do LinkedIn
- Configure imagem de perfil

## 🌐 Deploy

### Opção 1: Deploy Simples
1. Execute `npm run build` para build de produção
2. Execute `npm start` para iniciar em produção
3. Configure proxy reverso (nginx) se necessário

### Opção 2: Deploy com Docker
```dockerfile
# Dockerfile sugerido
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

### Opção 3: Deploy em VPS/Cloud
1. Faça upload dos arquivos para o servidor
2. Execute `npm install`
3. Execute `npx tsx server/migrate.ts`
4. Configure PM2 ou similar para manter o processo ativo
5. Configure nginx como proxy reverso

## 📝 Scripts Úteis

```bash
# Desenvolvimento
npm run dev                # Inicia servidor de desenvolvimento

# Build
npm run build             # Build para produção
npm run start             # Inicia servidor de produção

# Banco de Dados
npx tsx server/migrate.ts # Cria/atualiza tabelas SQLite

# Verificações
npm run check             # Verificação de tipos TypeScript
```

## 🗃️ Banco de Dados

O projeto usa SQLite local com as seguintes tabelas:
- `users` - Usuários e admins
- `projects` - Projetos do portfólio
- `experiences` - Experiências profissionais
- `achievements` - Conquistas e certificações
- `comments` - Sistema de comentários
- `likes` - Sistema de curtidas
- `files` - Arquivos enviados
- `sessions` - Sessões de usuário

### Localização dos dados:
- **Banco**: `./data/database.db`
- **Sessões**: `./data/sessions.db`
- **Uploads**: `./uploads/`

## 🔧 Personalização

### 1. Alterar dados do admin padrão
Edite o arquivo `server/storage.ts` na função `initializeDefaultUser()`:

```typescript
await this.createUser({
  email: "seu-email@exemplo.com",
  password: "sua-senha-segura",
  firstName: "Seu",
  lastName: "Nome",
  isAdmin: true,
});
```

### 2. Customizar tema
Edite o arquivo `client/src/index.css` ou use as classes Tailwind CSS nos componentes.

### 3. Adicionar novas funcionalidades
1. Adicione campos no `shared/schema.ts`
2. Execute `npx tsx server/migrate.ts`
3. Implemente as rotas em `server/routes.ts`
4. Crie componentes frontend em `client/src/components/`

## 🚨 Importante

- **Backup**: Faça backup da pasta `data/` regularmente
- **Segurança**: Altere a senha padrão antes do deploy
- **SSL**: Use HTTPS em produção
- **Firewall**: Configure adequadamente as portas
- **Monitoramento**: Use PM2 ou similar para monitorar o processo

## 📞 Suporte

Este projeto foi configurado para funcionar localmente sem variáveis de ambiente. Todas as configurações são automáticas e o banco de dados é criado automaticamente na primeira execução.

## 📄 Licença

MIT License - Livre para uso pessoal e comercial.