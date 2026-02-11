# 🚀 Guia Completo: GitHub → Render → App Mobile

Guia passo-a-passo para subir o servidor no GitHub, publicar no Render e integrar com o app mobile.

---

## 📋 PARTE 1: Preparar o Repositório GitHub

### 1.1 Criar conta no GitHub (se não tiver)

1. Acesse https://github.com
2. Clique em **"Sign up"**
3. Preencha os dados e confirme o email

### 1.2 Criar novo repositório

1. Clique no ícone **"+"** (canto superior direito)
2. Selecione **"New repository"**
3. Preencha:
   - **Repository name**: `bingo-server` (ou seu nome preferido)
   - **Description**: `Backend server for Bingo Master Lite`
   - **Visibility**: `Public` (ou Private se preferir)
   - **Initialize this repository with**: Deixe em branco
4. Clique **"Create repository"**

### 1.3 Fazer push do código para GitHub

**No seu computador:**

```bash
# 1. Descompactar o ZIP
unzip bingo-server-v2.zip
cd bingo-server

# 2. Inicializar Git (se não tiver feito)
git init
git add .
git commit -m "Inicial: Servidor Bingo Master Lite"

# 3. Adicionar remote (copie a URL do seu repositório GitHub)
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/bingo-server.git

# 4. Fazer push
git push -u origin main
```

**Pronto!** Seu código está no GitHub.

---

## 🗄️ PARTE 2: Configurar Banco de Dados

### Opção A: PlanetScale (Recomendado - Grátis)

#### 2.1 Criar conta PlanetScale

1. Acesse https://planetscale.com
2. Clique em **"Sign up"**
3. Conecte com GitHub (mais fácil)
4. Confirme email

#### 2.2 Criar banco de dados

1. Clique em **"Create a new database"**
2. Nome: `bingo-master-lite`
3. Region: Escolha a mais próxima de você
4. Clique **"Create database"**

#### 2.3 Obter credenciais

1. Vá para **"Connect"**
2. Selecione **"Node.js"** (ou MySQL CLI)
3. Copie a string de conexão

**Exemplo de string:**
```
mysql://abc123:pscale_pw_xyz@aws.connect.psdb.cloud/bingo-master-lite?sslaccept=strict
```

**Extrair dados:**
- `DB_HOST`: `aws.connect.psdb.cloud`
- `DB_USER`: `abc123`
- `DB_PASSWORD`: `pscale_pw_xyz`
- `DB_NAME`: `bingo-master-lite`
- `DB_PORT`: `3306`

#### 2.4 Criar as tabelas

**Opção 1: Usando PlanetScale CLI**

```bash
# Instalar CLI (se não tiver)
# https://github.com/planetscale/cli

# Fazer login
pscale auth login

# Executar schema
pscale shell bingo-master-lite main < database/schema.sql
```

**Opção 2: Usando MySQL CLI**

```bash
mysql -h aws.connect.psdb.cloud -u abc123 -p bingo-master-lite < database/schema.sql
# Digite a senha quando solicitado
```

### Opção B: AWS RDS

1. Acesse https://aws.amazon.com
2. Vá para **RDS** → **Create database**
3. Engine: MySQL 8.0
4. Preencha os dados
5. Clique **"Create database"**
6. Aguarde 5-10 minutos
7. Copie o endpoint e credenciais
8. Execute o schema SQL

### Opção C: DigitalOcean

1. Acesse https://digitalocean.com
2. Crie um cluster MySQL
3. Copie as credenciais
4. Execute o schema SQL

---

## 🌐 PARTE 3: Deploy no Render

### 3.1 Criar conta no Render

1. Acesse https://render.com
2. Clique em **"Get started"**
3. Faça login com GitHub (mais fácil)
4. Autorize o acesso

### 3.2 Criar novo Web Service

1. Clique em **"New +"** (canto superior direito)
2. Selecione **"Web Service"**
3. Selecione **"GitHub"**
4. Procure por `bingo-server`
5. Clique **"Connect"**

### 3.3 Configurar o serviço

Preencha os campos:

| Campo | Valor |
|-------|-------|
| **Name** | `bingo-master-lite-api` |
| **Environment** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Plan** | `Free` (ou pago) |

### 3.4 Adicionar variáveis de ambiente

Clique em **"Advanced"** → **"Add Environment Variable"**

Adicione **TODAS** estas variáveis:

```
PORT=3000
NODE_ENV=production

# Banco de Dados (do PlanetScale/AWS/DigitalOcean)
DB_HOST=seu-host-mysql
DB_PORT=3306
DB_USER=seu-usuario
DB_PASSWORD=sua-senha
DB_NAME=bingo_master_lite
DB_POOL_SIZE=10

# JWT
JWT_SECRET=sua-chave-secreta-super-segura-aqui-min-32-caracteres
JWT_EXPIRE=7d

# PIX
PIX_KEY=chave-pix-bingo@banco.com
PIX_BANK=Banco do Bingo
PIX_AGENCY=0001
PIX_ACCOUNT=123456-7
PIX_ACCOUNT_HOLDER=Bingo Master Lite

# Mercado Pago (opcional, se usar)
MERCADO_PAGO_ACCESS_TOKEN=seu-token-aqui
MERCADO_PAGO_PUBLIC_KEY=sua-chave-publica-aqui

# WhatsApp
WHATSAPP_API_URL=https://api.whatsapp.com/send
WHATSAPP_SUPPORT_NUMBER=5511999999999
WHATSAPP_PAYMENT_NUMBER=5511999999999

# CORS (URL do app mobile + Render)
CORS_ORIGIN=https://bingo-master-lite-api.onrender.com,https://seu-dominio-app.com

# Email (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASSWORD=sua-senha-app

# Configurações de Jogo
GAME_MAX_BALLS=90
GAME_SERIES_SIZE=6
GAME_CARDS_PER_SERIES=1
GAME_NUMBERS_PER_CARD=15
GAME_COLUMNS=9

# Porcentagens de Premiação
PRIZE_PERCENTAGE_LINE=10
PRIZE_PERCENTAGE_QUADRA=15
PRIZE_PERCENTAGE_BINGO=50
PRIZE_PERCENTAGE_ACCUMULATED=25
```

### 3.5 Deploy

Clique em **"Create Web Service"** e aguarde.

**Você verá:**
```
✓ Build successful
✓ Deploy successful
```

**Sua URL será:** `https://bingo-master-lite-api.onrender.com`

### 3.6 Validar deploy

```bash
# Testar health check
curl https://bingo-master-lite-api.onrender.com/health

# Resposta esperada:
# {"status":"ok","timestamp":"...","uptime":...}
```

---

## 📱 PARTE 4: Integrar com App Mobile

### 4.1 Atualizar URL da API no app mobile

**Arquivo:** `bingo-mobile-app/lib/api/client.ts`

```typescript
// Alterar esta linha:
const API_URL = 'http://localhost:3000/api/v1';

// Para:
const API_URL = 'https://bingo-master-lite-api.onrender.com/api/v1';
```

### 4.2 Atualizar CORS_ORIGIN no Render

Se o app mobile estiver em um domínio específico, adicione em `CORS_ORIGIN`:

```
CORS_ORIGIN=https://bingo-master-lite-api.onrender.com,https://seu-app-mobile.com
```

### 4.3 Testar integração

1. Abra o app mobile
2. Vá para a tela de login
3. Tente registrar uma nova conta
4. Verifique se os dados aparecem

**Se der erro de CORS:**
- Verifique se `CORS_ORIGIN` está correto no Render
- Aguarde 1-2 minutos para as mudanças serem aplicadas

---

## 🔑 PARTE 5: Guia de Variáveis de Ambiente

### Variáveis Essenciais

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `PORT` | Porta do servidor | `3000` |
| `NODE_ENV` | Ambiente | `production` |
| `DB_HOST` | Host do MySQL | `aws.connect.psdb.cloud` |
| `DB_PORT` | Porta MySQL | `3306` |
| `DB_USER` | Usuário MySQL | `abc123` |
| `DB_PASSWORD` | Senha MySQL | `pscale_pw_xyz` |
| `DB_NAME` | Nome do banco | `bingo_master_lite` |
| `JWT_SECRET` | Chave JWT (min 32 caracteres) | `sua-chave-super-segura` |

### Variáveis de PIX

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `PIX_KEY` | Chave PIX | `chave-pix@banco.com` |
| `PIX_BANK` | Nome do banco | `Banco do Bingo` |
| `PIX_AGENCY` | Agência | `0001` |
| `PIX_ACCOUNT` | Conta | `123456-7` |
| `PIX_ACCOUNT_HOLDER` | Titular | `Bingo Master Lite` |

### Variáveis de WhatsApp

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `WHATSAPP_SUPPORT_NUMBER` | Número suporte | `5511999999999` |
| `WHATSAPP_PAYMENT_NUMBER` | Número pagamento | `5511999999999` |

### Variáveis de Jogo

| Variável | Descrição | Valor |
|----------|-----------|-------|
| `GAME_MAX_BALLS` | Total de bolas | `90` |
| `GAME_SERIES_SIZE` | Cartelas por série | `6` |
| `GAME_NUMBERS_PER_CARD` | Números por cartela | `15` |
| `GAME_COLUMNS` | Colunas de números | `9` |

### Variáveis de Premiação (%)

| Variável | Descrição | Valor Recomendado |
|----------|-----------|-------------------|
| `PRIZE_PERCENTAGE_LINE` | % para linha | `10` |
| `PRIZE_PERCENTAGE_QUADRA` | % para quadra | `15` |
| `PRIZE_PERCENTAGE_BINGO` | % para bingo | `50` |
| `PRIZE_PERCENTAGE_ACCUMULATED` | % acumulado | `25` |

---

## 🧪 PARTE 6: Testar Endpoints

### 6.1 Registrar novo usuário

```bash
curl -X POST https://bingo-master-lite-api.onrender.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "user": "12345678900",
    "name": "João Silva",
    "whatsapp": "11999999999",
    "password": "senha123"
  }'
```

**Resposta esperada:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "cpf": "12345678900",
    "name": "João Silva",
    "whatsapp": "11999999999",
    "saldo": 0
  },
  "cards": []
}
```

### 6.2 Fazer login

```bash
curl -X POST https://bingo-master-lite-api.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "user": "12345678900",
    "password": "senha123"
  }'
```

### 6.3 Obter saldo

```bash
curl -X GET https://bingo-master-lite-api.onrender.com/api/v1/finance/balance \
  -H "Authorization: Bearer {token}"
```

### 6.4 Solicitar depósito

```bash
curl -X POST https://bingo-master-lite-api.onrender.com/api/v1/finance/deposit \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50.00
  }'
```

### 6.5 Solicitar saque

```bash
curl -X POST https://bingo-master-lite-api.onrender.com/api/v1/finance/withdraw \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100.00,
    "pixKey": "chave-pix-usuario@banco.com"
  }'
```

---

## 🔄 PARTE 7: Atualizações Futuras

### Fazer mudanças no código

```bash
# 1. Fazer alterações nos arquivos
# 2. Commit e push
git add .
git commit -m "Descrição da mudança"
git push origin main

# O Render fará o deploy automaticamente!
```

### Ver logs no Render

1. Acesse https://render.com
2. Clique no seu serviço
3. Vá para **"Logs"**
4. Veja os logs em tempo real

---

## 🐛 PARTE 8: Troubleshooting

### Erro: "Build failed"

**Solução:**
- Verifique os logs no Render
- Certifique-se de que `package.json` está correto
- Verifique se há erros de TypeScript

### Erro: "Cannot connect to database"

**Solução:**
- Verifique credenciais do banco
- Certifique-se de que o banco está online
- Se usar AWS RDS, verifique firewall/security groups
- Se usar PlanetScale, verifique se a branch está criada

### Erro: "CORS error" no app mobile

**Solução:**
- Adicione a URL do app em `CORS_ORIGIN`
- Aguarde 1-2 minutos para as mudanças serem aplicadas
- Verifique se a URL está correta (com https://)

### Erro: "Token inválido"

**Solução:**
- Certifique-se de que `JWT_SECRET` é o mesmo em produção
- Regenere o token fazendo login novamente

### Erro: "Saldo insuficiente"

**Solução:**
- Faça um depósito primeiro
- Aguarde a confirmação do depósito

---

## ✅ Checklist Final

- [ ] Repositório criado no GitHub
- [ ] Código feito push no GitHub
- [ ] Banco de dados criado (PlanetScale/AWS/DigitalOcean)
- [ ] Schema SQL executado
- [ ] Conta criada no Render
- [ ] Web Service criado no Render
- [ ] Todas as variáveis de ambiente adicionadas
- [ ] Deploy bem-sucedido
- [ ] Health check testado
- [ ] Registro de usuário testado
- [ ] Login testado
- [ ] App mobile atualizado com URL da API
- [ ] Integração testada no app mobile

---

## 📞 Suporte

Se tiver dúvidas:

1. **GitHub Issues**: Abra uma issue no repositório
2. **Render Docs**: https://render.com/docs
3. **PlanetScale Docs**: https://planetscale.com/docs
4. **Node.js Docs**: https://nodejs.org/docs

---

## 🎉 Parabéns!

Seu servidor está pronto para produção! 🚀

**URL do servidor:** `https://bingo-master-lite-api.onrender.com`

Agora você pode:
- ✅ Gerenciar usuários
- ✅ Processar depósitos e saques
- ✅ Controlar sorteios
- ✅ Gerar cartelas
- ✅ Registrar prêmios

Divirta-se! 🎰
