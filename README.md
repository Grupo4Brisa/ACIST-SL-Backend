# ACIST-SL-Backend

Backend do sistema de gestão da ACIST São Leopoldo.

---

# 🚀 Tecnologias Utilizadas

- NestJS
- TypeScript
- PostgreSQL
- JWT Authentication
- TypeORM

---

# 📦 Pré-requisitos

Antes de iniciar o projeto, é necessário ter instalado:

## ✅ Node.js

Download:
https://nodejs.org/

Verificar instalação:

```bash
node -v
npm -v
```

---

## ✅ PostgreSQL

Download:
https://www.postgresql.org/download/

Durante a instalação:

- Usuário padrão: `postgres`
- Senha definida na instalação
- Porta padrão: `5432`

---

## ✅ Git

Download:
https://git-scm.com/downloads

Verificar instalação:

```bash
git --version
```

---

# 📥 Clonar o Projeto

No terminal:

```bash
git clone URL_DO_REPOSITORIO
```

Entrar na pasta do projeto:

```bash
cd ACIST-SL-Backend
```

---

# 📦 Instalar Dependências

No terminal:

```bash
npm install
```

---

# ⚙️ Configurar Variáveis de Ambiente

Criar um arquivo chamado:

```txt
.env
```

Na raiz do projeto.

Adicionar:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=SUA_SENHA
DATABASE_NAME=acist

JWT_SECRET=acist_secret
```

⚠️ Trocar `SUA_SENHA` pela senha utilizada na instalação do PostgreSQL.

---

# 🗄️ Criar Banco de Dados

Abrir o pgAdmin.

Criar um banco chamado:

```txt
acist
```

---

# ▶️ Rodar o Projeto

No terminal:

```bash
npm run start:dev
```

Se aparecer algo semelhante a:

```txt
[Nest] application successfully started
```

O backend está funcionando corretamente.

---

# 🌐 URL Local

```txt
http://localhost:3000
```

---

# 📁 Estrutura do Projeto

```txt
src/
 ├── auth/
 ├── users/
 ├── companies/
 ├── documents/
 ├── approvals/
 ├── common/
 ├── config/
 └── database/
```

---

# 🌿 Fluxo de Trabalho Git

## Atualizar projeto

```bash
git pull
```

---

## Criar nova branch

```bash
git checkout -b nome-da-branch
```

Exemplo:

```bash
git checkout -b feature/login
```

---

## Verificar alterações

```bash
git status
```

---

## Adicionar alterações

```bash
git add .
```

---

## Criar commit

```bash
git commit -m "descrição da alteração"
```

Exemplo:

```bash
git commit -m "feat: create login screen"
```

---

## Enviar alterações para o GitHub

```bash
git push
```

---

# ⚠️ Importante

- Nunca alterar diretamente a branch `main`
- Sempre criar uma nova branch para desenvolver
- Nunca subir o arquivo `.env`
- Sempre executar `git pull` antes de iniciar alterações

---

# 👥 Equipe

Projeto desenvolvido pelo Grupo 4 para ACIST São Leopoldo.