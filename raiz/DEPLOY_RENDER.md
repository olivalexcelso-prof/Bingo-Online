# 🚀 Guia de Deploy no Render

Este guia passo-a-passo vai te ajudar a fazer o deploy do servidor Bingo Master Lite no Render.

## ✅ Pré-requisitos

- ✅ Conta no GitHub com o repositório criado
- ✅ Conta no Render (https://render.com)
- ✅ Banco de dados MySQL (PlanetScale, AWS RDS, DigitalOcean, etc)

## 📋 Passo 1: Preparar o Repositório GitHub

### 1.1 Criar repositório no GitHub

```bash
# No seu computador, dentro da pasta bingo-server
git init
git add .
git commit -m "Inicial: Servidor Bingo Master Lite"
git branch -M main
git remote add origin https://github.com/seu-usuario/bingo-server.git
git push -u origin main
```

### 1.2 Verificar arquivos importantes

Certifique-se de que estes arquivos estão no repositório:
- ✅ `package.json`
- ✅ `tsconfig.json`
- ✅ `src/index.ts`
- ✅ `.env.example` (NÃO fazer push de `.env`)
- ✅ `database/schema.sql`
- ✅ `.gitignore` (deve conter `.env`)

## 🗄️ Passo 2: Criar Banco de Dados

### Opção A: PlanetScale (Recomendado - Grátis)

1. Acesse https://planetscale.com
2. Crie uma conta
3. Clique em **"Create a database"**
4. Nome: `bingo-master-lite`
5. Clique em **"Create database"**
6. Vá para **"Connect"** e copie a string de conexão

**Extrair dados da string:**
```
mysql://user:password@host/database
```

Exemplo:
```
mysql://abc123:pscale_pw_xyz@aws.connect.psdb.cloud/bingo-master-lite?sslaccept=strict
```

Extrair:
- `DB_HOST`: `aws.connect.psdb.cloud`
- `DB_USER`: `abc123`
- `DB_PASSWORD`: `pscale_pw_xyz`
- `DB_NAME`: `bingo-master-lite`
- `DB_PORT`: `3306`

### Opção B: AWS RDS

1. Acesse https://aws.amazon.com
2. Vá para RDS
3. Crie uma instância MySQL
4. Copie o endpoint

### Opção C: DigitalOcean

1. Acesse https://digitalocean.com
2. Crie um cluster MySQL
3. Copie as credenciais

### Criar as tabelas

Depois de ter o banco criado:

```bash
# Se usando PlanetScale CLI
pscale shell bingo-master-lite main < database/schema.sql

# Ou via MySQL CLI
mysql -h seu-host -u seu-usuario -p seu-banco < database/schema.sql
```

## 🎯 Passo 3: Configurar no Render

### 3.1 Criar novo Web Service

1. Acesse https://render.com
2. Faça login com sua conta GitHub
3. Clique em **"New +"** (canto superior direito)
4. Selecione **"Web Service"**

### 3.2 Conectar repositório

1. Selecione **"GitHub"**
2. Procure por `bingo-server` (ou seu nome do repositório)
3. Clique em **"Connect"**

### 3.3 Configurar serviço

Preencha os campos:

| Campo | Valor |
|-------|-------|
| **Name** | `bingo-master-lite-api` |
| **Environment** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Plan** | `Free` (ou pago se preferir) |

### 3.4 Adicionar variáveis de ambiente

Clique em **"Advanced"** e depois em **"Add Environment Variable"**

Adicione estas variáveis (copie do seu `.env`):

```
PORT=3000
NODE_ENV=production
DB_HOST=seu-host-mysql
DB_PORT=3306
DB_USER=seu-usuario
DB_PASSWORD=sua-senha
DB_NAME=bingo_master_lite
JWT_SECRET=sua-chave-secreta-super-segura-aqui
PIX_KEY=chave-pix-bingo@banco.com
PIX_BANK=Banco do Bingo
CORS_ORIGIN=https://seu-app-mobile.com,https://seu-dominio.onrender.com
WHATSAPP_SUPPORT_NUMBER=5511999999999
WHATSAPP_PAYMENT_NUMBER=5511999999999
```

⚠️ **IMPORTANTE**: Não use valores de exemplo! Use seus valores reais!

### 3.5 Deploy

Clique em **"Create Web Service"** e aguarde o deploy.

Você verá uma tela com logs do deploy. Aguarde até ver:

```
✓ Build successful
✓ Deploy successful
```

Sua URL será algo como: `https://bingo-master-lite-api.onrender.com`

## ✅ Passo 4: Validar Deploy

### 4.1 Testar Health Check

```bash
curl https://bingo-master-lite-api.onrender.com/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "timestamp": "2026-02-10T20:00:00.000Z",
  "uptime": 123.45
}
```

### 4.2 Testar Login

```bash
curl -X POST https://bingo-master-lite-api.onrender.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "user": "12345678900",
    "name": "Teste",
    "whatsapp": "11999999999",
    "password": "teste123"
  }'
```

Resposta esperada:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

### 4.3 Testar no App Mobile

1. Abra o app mobile
2. Tente fazer login com as credenciais de teste
3. Verifique se os dados aparecem corretamente

## 🔄 Passo 5: Atualizações Futuras

Sempre que fizer mudanças no código:

```bash
git add .
git commit -m "Descrição da mudança"
git push origin main
```

O Render fará o deploy automaticamente!

## 🐛 Troubleshooting

### Erro: "Build failed"

Verifique os logs no Render. Geralmente é:
- Falta de dependência em `package.json`
- Erro de TypeScript
- Variável de ambiente faltando

### Erro: "Cannot connect to database"

Verifique:
- Credenciais do banco estão corretas
- Banco de dados está online
- Firewall permite conexões (especialmente em AWS RDS)

### Erro: "CORS error" no app mobile

Adicione a URL do seu app em `CORS_ORIGIN`:

```
CORS_ORIGIN=https://seu-app-mobile.com,https://seu-dominio.onrender.com
```

### Erro: "Token inválido"

Certifique-se de que `JWT_SECRET` é o mesmo em produção e desenvolvimento.

## 📊 Monitoramento

No painel do Render, você pode:

- ✅ Ver logs em tempo real
- ✅ Verificar CPU e memória
- ✅ Reiniciar o serviço
- ✅ Ver histórico de deploys
- ✅ Configurar alertas

## 🎉 Pronto!

Seu servidor está pronto para receber requisições do app mobile!

**URL do servidor:** `https://bingo-master-lite-api.onrender.com`

Adicione esta URL no app mobile em `lib/api/client.ts`:

```typescript
const API_URL = 'https://bingo-master-lite-api.onrender.com/api/v1';
```

---

Para dúvidas, consulte:
- 📖 [Documentação Render](https://render.com/docs)
- 📖 [Documentação PlanetScale](https://planetscale.com/docs)
- 💬 [GitHub Issues](https://github.com/seu-usuario/bingo-server/issues)
