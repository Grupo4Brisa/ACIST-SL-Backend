# ACIST-SL — Backend

API do sistema de cadastro de associados da ACIST São Leopoldo.

Feito em NestJS + TypeORM + PostgreSQL.

**Deploy em produção:** https://acist-sl-backend.onrender.com

## Como rodar o projeto

```bash
git clone <URL_DO_REPOSITORIO>
cd acist-sl-backend
npm install
cp .env.example .env
npm run start:dev
```

Edita o `.env` antes de rodar (veja abaixo o que cada variável faz). A API abre em `http://localhost:3000` por padrão, com documentação Swagger em `http://localhost:3000/api`.

Pré-requisito: um banco PostgreSQL rodando e acessível (local ou remoto).

## Variáveis do .env

```dotenv
# Conexão com o banco de dados
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=sua_senha
DATABASE_NAME=acist

# Chave usada para assinar os tokens de login (JWT)
JWT_SECRET=acist_secret

# Provedor de e-mail (Brevo) — usado para enviar mensagens
# automáticas do sistema (link de continuação de cadastro
# por token, aviso de aprovação, etc)
BREVO_API_KEY=sua_chave_da_api_brevo
MAIL_FROM_EMAIL=email_remetente_verificado_no_brevo
MAIL_FROM_NAME=ACIST São Leopoldo

# URL pública onde o FRONTEND está publicado — usada para
# montar os links enviados por e-mail (ex: link de
# continuação de cadastro). Sem essa variável, os e-mails
# usam http://localhost:5173, o que só funciona localmente.
FRONTEND_URL=http://localhost:5173

# Feature flags — precisam bater com as do frontend
ASSOCIATE_AREA=true
ASSOCIATE_LOGIN=true
LANDING_PASSWORD=true

# Admin criado automaticamente na primeira vez que o
# sistema sobe sem nenhum administrador cadastrado
SEED_ADMIN_EMAIL=admin@teste.com
SEED_ADMIN_PASSWORD=senha12345
SEED_ADMIN_NAME=Administrador
```

## Banco de dados

Com essas variáveis preenchidas, o próprio backend cria as tabelas ao subir (`synchronize: true`, configurado só para desenvolvimento). Não precisa rodar nenhum script de migration manualmente.

⚠️ Isso é seguro em desenvolvimento, mas não deve ser usado em produção — lá o ideal é trocar para migrations controladas, para evitar que o schema mude sozinho.

## JWT_SECRET

Qualquer string, mas em produção use algo longo e aleatório (não deixe `acist_secret` de exemplo). Se essa chave for trocada, todos os tokens já emitidos deixam de funcionar e todo mundo precisa logar de novo.

## Feature flags

Essas três variáveis definem qual versão do sistema está ativa. Precisam ser as mesmas nos dois lados (frontend e backend), senão o cadastro quebra:

| Variável | O que controla |
|---|---|
| `ASSOCIATE_AREA` | Se existe área logada para o associado |
| `ASSOCIATE_LOGIN` | Se o associado usa login/senha (ou token por e-mail) |
| `LANDING_PASSWORD` | Se a tela inicial pede senha no cadastro |

## Admin inicial (seed)

Se o sistema subir e não existir nenhum usuário com perfil Administrador no banco, ele cria um automaticamente usando `SEED_ADMIN_EMAIL` e `SEED_ADMIN_PASSWORD`. Isso resolve o problema de "como criar o primeiro colaborador" em um banco novo (por exemplo, em um ambiente de deploy recém-criado).

Depois do primeiro login, recomenda-se:
- Trocar a senha desse admin pela tela de gestão de colaboradores, ou criar outro admin e desativar esse.
- Remover as variáveis `SEED_ADMIN_*` do ambiente — elas só são necessárias nesse primeiro boot.

Se já existir um administrador no banco, essas variáveis são ignoradas e nada é criado de novo.

## Como conseguir o BREVO_API_KEY

1. Cria uma conta gratuita em [brevo.com](https://brevo.com) (não precisa cartão de crédito, plano grátis já cobre o uso do sistema — 300 e-mails/dia).
2. Vai em **Settings → Senders, Domains & Dedicated IPs** → aba **Senders** → **Add a Sender**.
3. Cadastra o e-mail que vai aparecer como remetente das mensagens (esse é o valor de `MAIL_FROM_EMAIL`).
4. O Brevo manda um e-mail de confirmação pra esse endereço — clica no link de verificação. Só depois disso o remetente fica "Verificado" e pode ser usado.
5. Vai em **Settings → SMTP & API → API Keys** → **Generate a new API key**, dá um nome (ex: `acist-backend`) e copia a chave gerada (começa com `xkeysib-...`).
6. Cola essa chave em `BREVO_API_KEY` no `.env`.

⚠️ Diferente de alguns outros provedores, o Brevo **não exige verificação de domínio** pra enviar e-mail pra qualquer destinatário — só o remetente precisa estar verificado (passo 4). Isso é o que permite o sistema mandar e-mail de verdade pra qualquer associado, mesmo sem um domínio próprio configurado.

## Estrutura básica

```
src/
├── auth/                  # Login, JWT, guards de permissão
├── users/                 # Colaboradores (admin/aprovador)
├── companies/             # Cadastro e aprovação de empresas associadas
├── company-contacts/      # Contatos vinculados à empresa
├── company-disclosures/   # Declarações/divulgações da empresa
├── company-solutions/     # Vínculo entre empresa e soluções escolhidas
├── solutions/              # Lista de soluções de interesse
├── documents/              # Upload e aprovação de documentos
├── payments/                # Registro e aprovação de pagamentos
├── events/                   # Eventos
├── event-registrations/      # Inscrições de associados em eventos
├── social-networks/          # Redes sociais da empresa
├── announcements/            # Comunicados/avisos
├── approvals/                 # Histórico/log de aprovações
├── tasks/                      # Tarefas internas dos colaboradores
├── terms-acceptance/           # Aceite de termos pelo associado
├── login-tokens/                # Tokens de acesso por link (quando ASSOCIATE_LOGIN=false)
├── mail/                         # Envio de e-mails (Brevo)
├── dashboard/                     # Dados agregados do Dashboard
└── config/
    └── features.config.ts         # Lê as feature flags do .env
```

Cada módulo segue o mesmo padrão do NestJS: `*.controller.ts` (rotas), `*.service.ts` (regras de negócio), `entities/` (tabelas do banco), `dto/` (validação dos dados recebidos).

## Permissões

Existem dois perfis de colaborador:
- **Administrador**: acesso completo, incluindo criar/editar/remover outros colaboradores.
- **Aprovador**: pode aprovar cadastros de empresas, documentos e pagamentos. Não gerencia colaboradores.

As rotas protegidas usam `JwtAuthGuard` (exige login) e `RolesGuard` (exige o perfil certo). Rotas usadas pelo associado durante o cadastro (landing, upload de documento, pagamento) são públicas, sem exigir login — só a área do colaborador é protegida.

## Documentação da API

Com o servidor rodando, a documentação interativa (Swagger) fica disponível em:

http://localhost:3000/api

## Deploy (Render)

Este projeto está publicado no Render: **https://acist-sl-backend.onrender.com**

Passo a passo pra atualizar o deploy:

1. Configura todas as variáveis do `.env` no painel do Render (**Environment**), incluindo as credenciais do banco de dados de produção (se for um Postgres gerenciado pelo próprio Render, os valores de host/usuário/senha ficam disponíveis na aba do banco de dados dentro do Render).
2. Confirma que `FRONTEND_URL` aponta pra URL real do frontend publicado (ex: `https://acist-sl-frontend.vercel.app`), não `localhost`.
3. Salvar as variáveis já dispara um redeploy automático. Pra aplicar mudanças de código, um `git push` no branch conectado ao Render também redeploya sozinho.
4. Depois do primeiro deploy, confirme que o admin inicial foi criado (log do console deve mostrar "Administrador inicial criado com sucesso") e faça login para validar.
5. Libere o CORS para a URL onde o frontend está hospedado, senão as requisições do navegador são bloqueadas.
6. Confirme que as feature flags aqui batem com as do frontend antes de liberar para teste.
