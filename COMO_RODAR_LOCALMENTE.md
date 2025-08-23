# Como Rodar o Projeto Localmente

## Pré-requisitos
- Node.js 18+ instalado
- Git
- VSCode (opcional, mas recomendado)

## Instruções

### 1. Clone o repositório
```bash
git clone [URL_DO_REPOSITORIO]
cd [NOME_DA_PASTA]
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Execute o projeto
```bash
npm run dev
```

### 4. Acesse no navegador
- Aplicação: http://localhost:5000
- A aplicação deve estar rodando e funcional

## Sobre o Deploy

**IMPORTANTE**: Este é um projeto Node.js/TypeScript, não Python. O PythonAnywhere não suporta este tipo de projeto.

### Alternativas de Deploy Recomendadas:
- **Vercel** (Recomendado para frontends)
- **Railway** (Para full-stack)
- **Heroku** (Clássico)
- **Netlify** (Para frontends estáticos)

### Para deploy no Vercel:
1. Faça push do código para GitHub
2. Conecte o repositório no Vercel
3. O deploy será automático

## Estrutura do Projeto
- `client/` - Frontend React/TypeScript
- `server/` - Backend Express/TypeScript  
- `shared/` - Schemas compartilhados
- `data/` - Banco de dados SQLite

## Scripts Disponíveis
- `npm run dev` - Modo desenvolvimento
- `npm run build` - Build para produção
- `npm start` - Executa versão de produção
- `npm run db:push` - Atualiza esquema do banco