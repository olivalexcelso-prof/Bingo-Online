# 📋 Passo-a-Passo Simplificado

Instruções rápidas e fáceis para subir o servidor.

---

## 🔴 PASSO 1: GitHub

### 1.1 Criar repositório

1. Acesse https://github.com/new
2. Nome: `bingo-server`
3. Clique **"Create repository"**

### 1.2 Fazer push do código

```bash
# No seu computador
unzip bingo-server-v2.zip
cd bingo-server

git init
git add .
git commit -m "Inicial"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/bingo-server.git
git push -u origin main
```

**Pronto!** Seu código está no GitHub.

---

## 🟠 PASSO 2: Banco de Dados

### 2.1 Criar banco no PlanetScale

1. Acesse https://planetscale.com
2. Clique **"Create a new database"**
3. Nome: `bingo-master-lite`
4. Clique **"Create database"**

### 2.2 Obter credenciais

1. Vá para **"Connect"**
2. Selecione **"Node.js"**
3. Copie a string de conexão

**Exemplo:**
```
mysql://abc123:pscale_pw_xyz@aws.connect.psdb.cloud/bingo-master-lite?sslaccept=strict
```

**Extrair:**
- `DB_HOST` = `aws.connect.psdb.cloud`
- `DB_USER` = `abc123`
- `DB_PASSWORD` = `pscale_pw_xyz`
- `DB_NAME` = `bingo-master-lite`

### 2.3 Criar as tabelas

```bash
# Instalar PlanetScale CLI
# https://github.com/planetscale/cli

# Fazer login
pscale auth login

# Executar schema
pscale shell bingo-master-lite main < database/schema.sql
```

**Pronto!** Banco criado com todas as tabelas.

---

## 🟡 PASSO 3: Render

### 3.1 Criar Web Service

1. Acesse https://render.com
2. Clique **"New +"** → **"Web Service"**
3. Selecione **"GitHub"**
4. Procure por `bingo-server`
5. Clique **"Connect"**

### 3.2 Configurar

| Campo | Valor |
|-------|-------|
| Name | `bingo-master-lite-api` |
| Environment | `Node` |
| Build Command | `npm install && npm run build` |
| Start Command | `npm start` |
| Plan | `Free` |

### 3.3 Adicionar variáveis de ambiente

Clique **"Advanced"** → **"Add Environment Variable"**

**Copie e cole todas estas variáveis:**

```
PORT=3000
NODE_ENV=production
DB_HOST=aws.connect.psdb.cloud
DB_PORT=3306
DB_USER=abc123
DB_PASSWORD=pscale_pw_xyz
DB_NAME=bingo-master-lite
DB_POOL_SIZE=10
JWT_SECRET=sua-chave-secreta-super-segura-aqui-min-32-caracteres
JWT_EXPIRE=7d
PIX_KEY=chave-pix-bingo@banco.com
PIX_BANK=Banco do Bingo
PIX_AGENCY=0001
PIX_ACCOUNT=123456-7
PIX_ACCOUNT_HOLDER=Bingo Master Lite
MERCADO_PAGO_ACCESS_TOKEN=seu-token-aqui
MERCADO_PAGO_PUBLIC_KEY=sua-chave-publica-aqui
WHATSAPP_API_URL=https://api.whatsapp.com/send
WHATSAPP_SUPPORT_NUMBER=5511999999999
WHATSAPP_PAYMENT_NUMBER=5511999999999
CORS_ORIGIN=https://bingo-master-lite-api.onrender.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASSWORD=sua-senha-app
GAME_MAX_BALLS=90
GAME_SERIES_SIZE=6
GAME_CARDS_PER_SERIES=1
GAME_NUMBERS_PER_CARD=15
GAME_COLUMNS=9
PRIZE_PERCENTAGE_LINE=10
PRIZE_PERCENTAGE_QUADRA=15
PRIZE_PERCENTAGE_BINGO=50
PRIZE_PERCENTAGE_ACCUMULATED=25
```

⚠️ **IMPORTANTE:** Substitua pelos seus valores reais!

### 3.4 Deploy

Clique **"Create Web Service"** e aguarde.

**Você verá:**
```
✓ Build successful
✓ Deploy successful
```

**Sua URL:** `https://bingo-master-lite-api.onrender.com`

---

## 🟢 PASSO 4: App Mobile

### 4.1 Atualizar URL da API

**Arquivo:** `bingo-mobile-app/lib/api/client.ts`

```typescript
// Alterar:
const API_URL = 'http://localhost:3000/api/v1';

// Para:
const API_URL = 'https://bingo-master-lite-api.onrender.com/api/v1';
```

### 4.2 Testar

1. Abra o app mobile
2. Tente registrar uma conta
3. Verifique se funciona

---

## 🔵 PASSO 5: Testar Endpoints

### Registrar usuário

```bash
curl -X POST https://bingo-master-lite-api.onrender.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "user": "12345678900",
    "name": "João",
    "whatsapp": "11999999999",
    "password": "senha123"
  }'
```

### Fazer login

```bash
curl -X POST https://bingo-master-lite-api.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "user": "12345678900",
    "password": "senha123"
  }'
```

### Obter saldo

```bash
curl -X GET https://bingo-master-lite-api.onrender.com/api/v1/finance/balance \
  -H "Authorization: Bearer {TOKEN_AQUI}"
```

---

## 📊 Resumo das Variáveis Importantes

| Variável | Onde Obter |
|----------|-----------|
| `DB_HOST` | PlanetScale → Connect |
| `DB_USER` | PlanetScale → Connect |
| `DB_PASSWORD` | PlanetScale → Connect |
| `DB_NAME` | `bingo-master-lite` |
| `JWT_SECRET` | Crie uma senha forte (min 32 caracteres) |
| `PIX_KEY` | Sua chave PIX real |
| `WHATSAPP_SUPPORT_NUMBER` | Seu número WhatsApp |
| `CORS_ORIGIN` | URL do seu servidor Render |

---

## ✅ Checklist

- [ ] Repositório criado no GitHub
- [ ] Código feito push
- [ ] Banco criado no PlanetScale
- [ ] Schema SQL executado
- [ ] Web Service criado no Render
- [ ] Variáveis adicionadas
- [ ] Deploy bem-sucedido
- [ ] Endpoints testados
- [ ] App mobile atualizado
- [ ] Integração funcionando

---

## 🆘 Problemas Comuns

### "Build failed"
- Verifique os logs no Render
- Certifique-se de que o código está correto

### "Cannot connect to database"
- Verifique credenciais do PlanetScale
- Certifique-se de que o banco está online

### "CORS error"
- Adicione a URL do app em `CORS_ORIGIN`
- Aguarde 1-2 minutos

---

## 🎉 Pronto!

Seu servidor está online em:
```
https://bingo-master-lite-api.onrender.com
```

Divirta-se! 🎰
