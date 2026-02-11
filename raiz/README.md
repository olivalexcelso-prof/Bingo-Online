# 🎰 Bingo Master Lite - Backend Server

Servidor backend completo para a plataforma de bingo Bingo Master Lite, desenvolvido com Node.js, Express, TypeScript e MySQL.

## 📋 Requisitos

- Node.js >= 18.0.0
- MySQL >= 5.7
- npm ou yarn

## 🚀 Instalação Rápida

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/bingo-server.git
cd bingo-server
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar banco de dados

#### Opção A: MySQL Local

```bash
# Criar banco de dados
mysql -u root -p < database/schema.sql

# Ou manualmente:
mysql -u root -p
mysql> CREATE DATABASE bingo_master_lite;
mysql> USE bingo_master_lite;
mysql> source database/schema.sql;
```

#### Opção B: MySQL Remoto (PlanetScale, AWS RDS, etc)

1. Crie um banco de dados remoto
2. Execute o schema SQL no seu banco remoto
3. Copie a string de conexão

### 4. Configurar variáveis de ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar .env com suas configurações
nano .env
```

**Variáveis essenciais:**

```env
# Servidor
PORT=3000
NODE_ENV=production

# Banco de Dados
DB_HOST=seu-host-mysql
DB_PORT=3306
DB_USER=seu-usuario
DB_PASSWORD=sua-senha
DB_NAME=bingo_master_lite

# JWT
JWT_SECRET=sua-chave-secreta-super-segura

# PIX
PIX_KEY=chave-pix-bingo@banco.com
PIX_BANK=Banco do Bingo

# CORS (URL do seu app mobile/web)
CORS_ORIGIN=https://seu-dominio.onrender.com
```

### 5. Iniciar servidor

**Desenvolvimento:**

```bash
npm run dev
```

**Produção:**

```bash
npm run build
npm start
```

## 📚 Estrutura do Projeto

```
bingo-server/
├── src/
│   ├── config/
│   │   └── database.ts          # Configuração do MySQL
│   ├── middleware/
│   │   └── auth.ts              # Autenticação JWT
│   ├── routes/
│   │   ├── auth.ts              # Login/Registro
│   │   ├── game.ts              # Sorteio/Cartelas
│   │   ├── finance.ts           # Depósito/Saque
│   │   └── support.ts           # Suporte/Ajuda
│   ├── utils/
│   │   └── card-generator.ts    # Gerador de cartelas
│   └── index.ts                 # Arquivo principal
├── database/
│   └── schema.sql               # Schema do banco
├── .env.example                 # Variáveis de exemplo
├── package.json
├── tsconfig.json
└── README.md
```

## 🔌 Endpoints da API

### Autenticação

#### POST `/api/v1/auth/login`

Fazer login com CPF e senha.

**Request:**
```json
{
  "user": "12345678900",
  "password": "senha123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "cpf": "12345678900",
    "name": "João Silva",
    "whatsapp": "11999999999",
    "saldo": 100.00
  },
  "cards": []
}
```

#### POST `/api/v1/auth/register`

Registrar novo usuário.

**Request:**
```json
{
  "user": "12345678900",
  "name": "João Silva",
  "whatsapp": "11999999999",
  "password": "senha123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... },
  "cards": []
}
```

### Jogo

#### GET `/api/v1/game/status?gameId=uuid`

Obter status do sorteio atual.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "game": {
    "id": "uuid",
    "title": "Bingo da Noite",
    "status": "running",
    "currentNumber": 45,
    "drawnNumbers": [1, 5, 12, 23, 45],
    "narration": "Número 45 - Quarenta e cinco",
    "totalRaised": 5000.00
  },
  "prizes": {
    "line": 100.00,
    "quadra": 500.00,
    "bingo": 2000.00,
    "accumulated": 1500.00,
    "totalAccumulated": 1500.00
  },
  "userCards": [ ... ],
  "recentPrizes": [ ... ]
}
```

### Finanças

#### GET `/api/v1/finance/balance`

Obter saldo do usuário.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "balance": 150.50
}
```

#### POST `/api/v1/finance/deposit`

Solicitar depósito via PIX.

**Request:**
```json
{
  "amount": 50.00
}
```

**Response:**
```json
{
  "success": true,
  "transactionId": "uuid",
  "pixKey": "chave-pix-bingo@banco.com",
  "pixBank": "Banco do Bingo",
  "amount": 50.00,
  "message": "Escaneie o QR code ou copie a chave PIX"
}
```

#### POST `/api/v1/finance/withdraw`

Solicitar saque.

**Request:**
```json
{
  "amount": 100.00,
  "pixKey": "chave-pix-usuario@banco.com"
}
```

**Response:**
```json
{
  "success": true,
  "withdrawalId": "uuid",
  "transactionId": "uuid",
  "status": "pending",
  "message": "Saque solicitado com sucesso"
}
```

### Suporte

#### POST `/api/v1/support/send`

Enviar mensagem de suporte (máximo 30 palavras).

**Request:**
```json
{
  "message": "Não consigo fazer login no aplicativo"
}
```

**Response:**
```json
{
  "success": true,
  "messageId": "uuid",
  "wordCount": 7,
  "message": "Mensagem enviada com sucesso",
  "whatsappUrl": "https://wa.me/5511999999999?text=..."
}
```

## 🌐 Deploy no Render

### 1. Fazer push no GitHub

```bash
git add .
git commit -m "Adicionar backend Bingo Master Lite"
git push origin main
```

### 2. Criar serviço no Render

1. Acesse https://render.com
2. Clique em **"New +"** → **"Web Service"**
3. Conecte seu repositório GitHub
4. Preencha os dados:
   - **Name**: `bingo-master-lite-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

### 3. Configurar variáveis de ambiente

No painel do Render, vá para **"Environment"** e adicione:

```
PORT=3000
NODE_ENV=production
DB_HOST=seu-host-mysql
DB_PORT=3306
DB_USER=seu-usuario
DB_PASSWORD=sua-senha
DB_NAME=bingo_master_lite
JWT_SECRET=sua-chave-secreta
CORS_ORIGIN=https://seu-dominio.onrender.com
```

### 4. Deploy

Clique em **"Create Web Service"** e aguarde o deploy.

## 🧪 Testando a API

### Com cURL

```bash
# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"user":"12345678900","password":"senha123"}'

# Obter status do jogo
curl -X GET http://localhost:3000/api/v1/game/status \
  -H "Authorization: Bearer {token}"
```

### Com Postman

1. Importe a coleção de endpoints
2. Configure a variável `{{token}}` após fazer login
3. Teste cada endpoint

## 🔐 Segurança

- ✅ Senhas criptografadas com bcryptjs
- ✅ Autenticação JWT
- ✅ CORS configurado
- ✅ Validação de entrada
- ✅ Rate limiting (recomendado adicionar)
- ✅ Logs de auditoria

## 📊 Banco de Dados

### Tabelas principais

- **users** - Usuários registrados
- **games** - Sorteios/Partidas
- **cards** - Cartelas de bingo
- **prizes** - Prêmios concedidos
- **transactions** - Histórico de transações
- **withdrawal_requests** - Solicitações de saque
- **support_messages** - Mensagens de suporte
- **advertisements** - Propagandas

## 🛠️ Desenvolvimento

### Adicionar nova rota

1. Criar arquivo em `src/routes/nova-rota.ts`
2. Importar em `src/index.ts`
3. Adicionar: `app.use('/api/v1/nova-rota', novaRotaRoutes);`

### Adicionar novo modelo

1. Criar arquivo em `src/models/novo-modelo.ts`
2. Usar `query()` para executar SQL

## 📝 Logs

Os logs são salvos em `database/logs` e incluem:

- Autenticação
- Transações
- Erros
- Ações administrativas

## 🐛 Troubleshooting

### Erro: "Connection refused"

```bash
# Verificar se MySQL está rodando
mysql -u root -p -e "SELECT 1"
```

### Erro: "CORS error"

Verifique se `CORS_ORIGIN` está configurado corretamente no `.env`.

### Erro: "Token inválido"

Certifique-se de que `JWT_SECRET` é o mesmo em produção e desenvolvimento.

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no GitHub.

## 📄 Licença

MIT

---

**Desenvolvido com ❤️ para Bingo Master Lite**
