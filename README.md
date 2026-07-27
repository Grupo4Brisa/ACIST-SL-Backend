# ACIST-SL — Backend

API do sistema de cadastro de associados da ACIST São Leopoldo.

Feito em **NestJS + TypeORM + PostgreSQL**.

---

## Como rodar o projeto

```bash
npm install
cp .env.example .env
npm run start:dev
```

Edita o `.env` antes de rodar (veja abaixo o que cada variável faz). A API abre em `http://localhost:3000` por padrão, com documentação Swagger em `http://localhost:3000/api`.

Pré-requisito: um banco **PostgreSQL** rodando e acessível.

---

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

# Conta de e-mail usada para enviar mensagens do sistema
# (ex: link de continuação de cadastro por token)
GMAIL_USER=seu_email
GMAIL_APP_PASSWORD=sua_senha

# Feature flags — precisam bater com as do frontend
ASSOCIATE_AREA=false
ASSOCIATE_LOGIN=false
LANDING_PASSWORD=false

# Admin criado automaticamente na primeira vez que o
# sistema sobe sem nenhum administrador cadastrado
SEED_ADMIN_EMAIL=admin@teste.com
SEED_ADMIN_PASSWORD=senha12345
SEED_ADMIN_NAME=Administrador
```

### Banco de dados

Com essas variáveis preenchidas, o próprio backend cria as tabelas ao subir (`synchronize: true`, configurado só para desenvolvimento). Não precisa rodar nenhum script de migration manualmente.

⚠️ Isso é seguro em desenvolvimento, mas não deve ser usado em produção — lá o ideal é trocar para migrations controladas, para evitar que o schema mude sozinho.

### JWT_SECRET

Qualquer string, mas em produção use algo longo e aleatório (não deixe `acist_secret` de exemplo). Se essa chave for trocada, todos os tokens já emitidos deixam de funcionar e todo mundo precisa logar de novo.

### Feature flags

Essas três variáveis definem qual versão do sistema está ativa. Precisam ser as mesmas nos dois lados (frontend e backend), senão o cadastro quebra:

| Variável | O que controla |
|---|---|
| `ASSOCIATE_AREA` | Se existe área logada para o associado |
| `ASSOCIATE_LOGIN` | Se o associado usa login/senha (ou token por e-mail) |
| `LANDING_PASSWORD` | Se a tela inicial pede senha no cadastro |

### Admin inicial (seed)

Se o sistema subir e não existir **nenhum** usuário com perfil Administrador no banco, ele cria um automaticamente usando `SEED_ADMIN_EMAIL` e `SEED_ADMIN_PASSWORD`. Isso resolve o problema de "como criar o primeiro colaborador" em um banco novo (por exemplo, em um ambiente de deploy recém-criado).

Depois do primeiro login, recomenda-se:
1. Trocar a senha desse admin pela tela de gestão de colaboradores, ou criar outro admin e desativar esse.
2. Remover as variáveis `SEED_ADMIN_*` do ambiente — elas só são necessárias nesse primeiro boot.

Se já existir um administrador no banco, essas variáveis são ignoradas e nada é criado de novo.

---

## Como conseguir o GMAIL_APP_PASSWORD

O Gmail não permite mais usar a senha normal da conta para aplicativos externos enviarem e-mail — é preciso gerar uma **senha de app** específica.

1. Acesse [myaccount.google.com/security](https://myaccount.google.com/security) com a conta de e-mail que vai enviar as mensagens.
2. Ative a **Verificação em duas etapas**, caso ainda não esteja ativa (é obrigatória para gerar senha de app).
3. Depois de ativada, volte em **Segurança** e procure por **Senhas de app** (em alguns idiomas aparece como "App passwords"). Se não aparecer direto na página, acesse [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords).
4. Dê um nome qualquer para identificar (ex: "ACIST Backend") e clique em gerar.
5. O Google mostra uma senha de 16 letras, sem espaços de verdade (algo como `abcd efgh ijkl mnop`). Copie ela.
6. Cole essa senha em `GMAIL_APP_PASSWORD` no `.env` — **sem espaços** e **sem usar a senha normal da conta**.

Use `GMAIL_USER` com o e-mail completo dessa conta (ex: `contato@acist.com.br`).

⚠️ Se a opção de "Senhas de app" não aparecer mesmo com a verificação em duas etapas ativa, geralmente é porque a conta é gerenciada por uma organização (Google Workspace) e o administrador do domínio precisa liberar essa opção.

---

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
├── mail/                         # Envio de e-mails (Gmail)
├── dashboard/                     # Dados agregados do Dashboard
└── config/
    └── features.config.ts         # Lê as feature flags do .env
```

Cada módulo segue o mesmo padrão do NestJS: `*.controller.ts` (rotas), `*.service.ts` (regras de negócio), `entities/` (tabelas do banco), `dto/` (validação dos dados recebidos).

---

## Permissões

Existem dois perfis de colaborador:

- **Administrador**: acesso completo, incluindo criar/editar/remover outros colaboradores.
- **Aprovador**: pode aprovar cadastros de empresas, documentos e pagamentos. Não gerencia colaboradores.

As rotas protegidas usam `JwtAuthGuard` (exige login) e `RolesGuard` (exige o perfil certo). Rotas usadas pelo associado durante o cadastro (landing, upload de documento, pagamento) são públicas, sem exigir login — só a área do colaborador é protegida.

---

## Documentação da API

Com o servidor rodando, a documentação interativa (Swagger) fica disponível em:

```
http://localhost:3000/api
```

---

## Deploy

- Configura todas as variáveis do `.env` no painel do serviço de hospedagem (Railway, etc.), incluindo as credenciais do novo banco de dados gerenciado.
- Depois do primeiro deploy, confirme que o admin inicial foi criado (log do console deve mostrar `Administrador inicial criado com sucesso`) e faça login para validar.
- Libere o **CORS** para a URL onde o frontend está hospedado, senão as requisições do navegador são bloqueadas.
- Confirme que as feature flags aqui batem com as do frontend antes de liberar para teste.