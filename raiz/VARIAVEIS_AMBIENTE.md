# 🔐 Guia Completo de Variáveis de Ambiente

Documentação detalhada de todas as variáveis de ambiente necessárias.

---

## 📌 Como Usar

1. **Localmente**: Crie arquivo `.env` na raiz do projeto
2. **Render**: Adicione em **"Environment"** do seu Web Service
3. **Produção**: Nunca commite `.env` no Git (está no `.gitignore`)

---

## 🔴 Variáveis Essenciais

### PORT
- **Descrição**: Porta do servidor
- **Tipo**: Número
- **Valor Padrão**: `3000`
- **Exemplo**: `3000`
- **Obrigatória**: Não
- **Render**: Deixe como `3000`

```env
PORT=3000
```

### NODE_ENV
- **Descrição**: Ambiente de execução
- **Tipo**: String
- **Valores Válidos**: `development`, `production`
- **Valor Padrão**: `development`
- **Exemplo**: `production`
- **Obrigatória**: Sim
- **Render**: Use `production`

```env
NODE_ENV=production
```

---

## 🟠 Variáveis de Banco de Dados

### DB_HOST
- **Descrição**: Host/endereço do servidor MySQL
- **Tipo**: String
- **Exemplo**: `aws.connect.psdb.cloud` (PlanetScale)
- **Exemplo**: `bingo-db.c.aivencloud.com` (Aiven)
- **Obrigatória**: Sim
- **Onde Obter**: 
  - PlanetScale: Dashboard → Connect
  - AWS RDS: Dashboard → Endpoint
  - DigitalOcean: Cluster → Connection Details

```env
DB_HOST=aws.connect.psdb.cloud
```

### DB_PORT
- **Descrição**: Porta do MySQL
- **Tipo**: Número
- **Valor Padrão**: `3306`
- **Exemplo**: `3306`
- **Obrigatória**: Não
- **Nota**: Geralmente é 3306 para todos os provedores

```env
DB_PORT=3306
```

### DB_USER
- **Descrição**: Usuário do banco de dados
- **Tipo**: String
- **Exemplo**: `abc123` (PlanetScale)
- **Obrigatória**: Sim
- **Onde Obter**: 
  - PlanetScale: Connect string
  - AWS RDS: Master username
  - DigitalOcean: Connection details

```env
DB_USER=abc123
```

### DB_PASSWORD
- **Descrição**: Senha do banco de dados
- **Tipo**: String
- **Exemplo**: `pscale_pw_xyz`
- **Obrigatória**: Sim
- **Segurança**: Nunca compartilhe ou commite
- **Onde Obter**: 
  - PlanetScale: Connect string
  - AWS RDS: Master password (que você criou)
  - DigitalOcean: Connection details

```env
DB_PASSWORD=pscale_pw_xyz
```

### DB_NAME
- **Descrição**: Nome do banco de dados
- **Tipo**: String
- **Valor Padrão**: `bingo_master_lite`
- **Exemplo**: `bingo_master_lite`
- **Obrigatória**: Sim
- **Nota**: Deve ser o mesmo que você criou

```env
DB_NAME=bingo_master_lite
```

### DB_POOL_SIZE
- **Descrição**: Número máximo de conexões simultâneas
- **Tipo**: Número
- **Valor Padrão**: `10`
- **Exemplo**: `10`
- **Obrigatória**: Não
- **Nota**: Aumentar se tiver muitos usuários simultâneos

```env
DB_POOL_SIZE=10
```

---

## 🟡 Variáveis de Autenticação JWT

### JWT_SECRET
- **Descrição**: Chave secreta para assinar tokens JWT
- **Tipo**: String
- **Comprimento Mínimo**: 32 caracteres
- **Exemplo**: `sua-chave-secreta-super-segura-aqui-com-32-caracteres`
- **Obrigatória**: Sim
- **Segurança**: 
  - Use caracteres aleatórios
  - Nunca compartilhe
  - Mude regularmente
  - Diferentes em dev e produção
- **Como Gerar**: 
  ```bash
  # Linux/Mac
  openssl rand -base64 32
  
  # Node.js
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

```env
JWT_SECRET=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```

### JWT_EXPIRE
- **Descrição**: Tempo de expiração do token
- **Tipo**: String (formato do npm package `jsonwebtoken`)
- **Valor Padrão**: `7d`
- **Exemplos**: `7d`, `24h`, `30d`, `1y`
- **Obrigatória**: Não
- **Nota**: Quanto maior, mais seguro (mas menos seguro se token vazar)

```env
JWT_EXPIRE=7d
```

---

## 🟢 Variáveis de PIX

### PIX_KEY
- **Descrição**: Chave PIX para receber pagamentos
- **Tipo**: String
- **Exemplos**: 
  - Email: `bingo@banco.com`
  - CPF: `12345678900`
  - Telefone: `11999999999`
  - Aleatória: `abc123de-f456-g789-h012-ijk345lmnop6`
- **Obrigatória**: Sim
- **Onde Obter**: Seu banco (app bancário)
- **Nota**: Deve ser uma chave PIX real que você possui

```env
PIX_KEY=chave-pix-bingo@banco.com
```

### PIX_BANK
- **Descrição**: Nome do banco
- **Tipo**: String
- **Exemplo**: `Banco do Bingo`
- **Obrigatória**: Não
- **Nota**: Apenas para exibição

```env
PIX_BANK=Banco do Bingo
```

### PIX_AGENCY
- **Descrição**: Número da agência bancária
- **Tipo**: String
- **Exemplo**: `0001`
- **Obrigatória**: Não
- **Nota**: Apenas para referência

```env
PIX_AGENCY=0001
```

### PIX_ACCOUNT
- **Descrição**: Número da conta bancária
- **Tipo**: String
- **Exemplo**: `123456-7`
- **Obrigatória**: Não
- **Nota**: Apenas para referência

```env
PIX_ACCOUNT=123456-7
```

### PIX_ACCOUNT_HOLDER
- **Descrição**: Nome do titular da conta
- **Tipo**: String
- **Exemplo**: `Bingo Master Lite`
- **Obrigatória**: Não
- **Nota**: Apenas para exibição

```env
PIX_ACCOUNT_HOLDER=Bingo Master Lite
```

---

## 🔵 Variáveis de Mercado Pago (Opcional)

### MERCADO_PAGO_ACCESS_TOKEN
- **Descrição**: Token de acesso da API do Mercado Pago
- **Tipo**: String
- **Exemplo**: `APP_USR-123456789-abcdefghij`
- **Obrigatória**: Não (apenas se usar Mercado Pago)
- **Onde Obter**: 
  1. Acesse https://www.mercadopago.com.br
  2. Vá para **"Credenciais"**
  3. Copie **"Access Token"**

```env
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-123456789-abcdefghij
```

### MERCADO_PAGO_PUBLIC_KEY
- **Descrição**: Chave pública do Mercado Pago
- **Tipo**: String
- **Exemplo**: `APP_USR-123456789-abcdefghij`
- **Obrigatória**: Não (apenas se usar Mercado Pago)
- **Onde Obter**: 
  1. Acesse https://www.mercadopago.com.br
  2. Vá para **"Credenciais"**
  3. Copie **"Public Key"**

```env
MERCADO_PAGO_PUBLIC_KEY=APP_USR-123456789-abcdefghij
```

---

## 🟣 Variáveis de WhatsApp

### WHATSAPP_API_URL
- **Descrição**: URL da API do WhatsApp
- **Tipo**: String
- **Valor Padrão**: `https://api.whatsapp.com/send`
- **Exemplo**: `https://api.whatsapp.com/send`
- **Obrigatória**: Não
- **Nota**: Não mude este valor

```env
WHATSAPP_API_URL=https://api.whatsapp.com/send
```

### WHATSAPP_SUPPORT_NUMBER
- **Descrição**: Número do WhatsApp para suporte
- **Tipo**: String (apenas números)
- **Formato**: `55` + DDD + número
- **Exemplo**: `5511999999999`
- **Obrigatória**: Sim
- **Nota**: Sem formatação, apenas números

```env
WHATSAPP_SUPPORT_NUMBER=5511999999999
```

### WHATSAPP_PAYMENT_NUMBER
- **Descrição**: Número do WhatsApp para pagamentos
- **Tipo**: String (apenas números)
- **Formato**: `55` + DDD + número
- **Exemplo**: `5511999999999`
- **Obrigatória**: Sim
- **Nota**: Pode ser o mesmo que WHATSAPP_SUPPORT_NUMBER

```env
WHATSAPP_PAYMENT_NUMBER=5511999999999
```

---

## 🌐 Variáveis de CORS

### CORS_ORIGIN
- **Descrição**: URLs permitidas para fazer requisições
- **Tipo**: String (separadas por vírgula)
- **Exemplo**: `https://bingo-master-lite-api.onrender.com,https://seu-app.com`
- **Obrigatória**: Sim
- **Nota**: Sempre inclua a URL do seu servidor Render
- **Múltiplos domínios**: Separe por vírgula, sem espaços

```env
CORS_ORIGIN=https://bingo-master-lite-api.onrender.com,https://seu-app-mobile.com
```

---

## 📧 Variáveis de Email (Opcional)

### SMTP_HOST
- **Descrição**: Host do servidor SMTP
- **Tipo**: String
- **Exemplo**: `smtp.gmail.com`
- **Obrigatória**: Não (apenas se enviar emails)
- **Provedores Comuns**:
  - Gmail: `smtp.gmail.com`
  - Outlook: `smtp-mail.outlook.com`
  - SendGrid: `smtp.sendgrid.net`

```env
SMTP_HOST=smtp.gmail.com
```

### SMTP_PORT
- **Descrição**: Porta do servidor SMTP
- **Tipo**: Número
- **Exemplo**: `587`
- **Obrigatória**: Não
- **Valores Comuns**: `587` (TLS), `465` (SSL)

```env
SMTP_PORT=587
```

### SMTP_USER
- **Descrição**: Usuário/email para autenticação SMTP
- **Tipo**: String
- **Exemplo**: `seu-email@gmail.com`
- **Obrigatória**: Não
- **Nota**: Geralmente é seu email

```env
SMTP_USER=seu-email@gmail.com
```

### SMTP_PASSWORD
- **Descrição**: Senha para autenticação SMTP
- **Tipo**: String
- **Exemplo**: `sua-senha-app`
- **Obrigatória**: Não
- **Segurança**: Nunca compartilhe
- **Gmail**: Use "Senha de App" (2FA ativado)

```env
SMTP_PASSWORD=sua-senha-app
```

---

## 🎮 Variáveis de Configuração do Jogo

### GAME_MAX_BALLS
- **Descrição**: Número máximo de bolas no sorteio
- **Tipo**: Número
- **Valor Padrão**: `90`
- **Exemplo**: `90`
- **Obrigatória**: Não
- **Nota**: Não mude (padrão de bingo)

```env
GAME_MAX_BALLS=90
```

### GAME_SERIES_SIZE
- **Descrição**: Número de cartelas por série
- **Tipo**: Número
- **Valor Padrão**: `6`
- **Exemplo**: `6`
- **Obrigatória**: Não
- **Nota**: Cada série tem 6 cartelas com todos os 90 números

```env
GAME_SERIES_SIZE=6
```

### GAME_CARDS_PER_SERIES
- **Descrição**: Cartelas por série por usuário
- **Tipo**: Número
- **Valor Padrão**: `1`
- **Exemplo**: `1`
- **Obrigatória**: Não

```env
GAME_CARDS_PER_SERIES=1
```

### GAME_NUMBERS_PER_CARD
- **Descrição**: Números por cartela
- **Tipo**: Número
- **Valor Padrão**: `15`
- **Exemplo**: `15`
- **Obrigatória**: Não
- **Nota**: 3 linhas x 5 colunas = 15 números

```env
GAME_NUMBERS_PER_CARD=15
```

### GAME_COLUMNS
- **Descrição**: Número de colunas de números
- **Tipo**: Número
- **Valor Padrão**: `9`
- **Exemplo**: `9`
- **Obrigatória**: Não
- **Nota**: 9 colunas (1-9, 10-19, 20-29, ..., 80-90)

```env
GAME_COLUMNS=9
```

---

## 💰 Variáveis de Premiação

### PRIZE_PERCENTAGE_LINE
- **Descrição**: Porcentagem da arrecadação para linha
- **Tipo**: Número (0-100)
- **Valor Padrão**: `10`
- **Exemplo**: `10`
- **Obrigatória**: Não
- **Nota**: % do total arrecadado

```env
PRIZE_PERCENTAGE_LINE=10
```

### PRIZE_PERCENTAGE_QUADRA
- **Descrição**: Porcentagem da arrecadação para quadra
- **Tipo**: Número (0-100)
- **Valor Padrão**: `15`
- **Exemplo**: `15`
- **Obrigatória**: Não

```env
PRIZE_PERCENTAGE_QUADRA=15
```

### PRIZE_PERCENTAGE_BINGO
- **Descrição**: Porcentagem da arrecadação para bingo
- **Tipo**: Número (0-100)
- **Valor Padrão**: `50`
- **Exemplo**: `50`
- **Obrigatória**: Não

```env
PRIZE_PERCENTAGE_BINGO=50
```

### PRIZE_PERCENTAGE_ACCUMULATED
- **Descrição**: Porcentagem da arrecadação para acumulado
- **Tipo**: Número (0-100)
- **Valor Padrão**: `25`
- **Exemplo**: `25`
- **Obrigatória**: Não
- **Nota**: Soma: 10 + 15 + 50 + 25 = 100%

```env
PRIZE_PERCENTAGE_ACCUMULATED=25
```

---

## 📋 Arquivo .env Completo

```env
# Servidor
PORT=3000
NODE_ENV=production

# Banco de Dados
DB_HOST=aws.connect.psdb.cloud
DB_PORT=3306
DB_USER=abc123
DB_PASSWORD=pscale_pw_xyz
DB_NAME=bingo_master_lite
DB_POOL_SIZE=10

# JWT
JWT_SECRET=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
JWT_EXPIRE=7d

# PIX
PIX_KEY=chave-pix-bingo@banco.com
PIX_BANK=Banco do Bingo
PIX_AGENCY=0001
PIX_ACCOUNT=123456-7
PIX_ACCOUNT_HOLDER=Bingo Master Lite

# Mercado Pago (Opcional)
MERCADO_PAGO_ACCESS_TOKEN=seu-token-aqui
MERCADO_PAGO_PUBLIC_KEY=sua-chave-publica-aqui

# WhatsApp
WHATSAPP_API_URL=https://api.whatsapp.com/send
WHATSAPP_SUPPORT_NUMBER=5511999999999
WHATSAPP_PAYMENT_NUMBER=5511999999999

# CORS
CORS_ORIGIN=https://bingo-master-lite-api.onrender.com

# Email (Opcional)
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

# Premiação (%)
PRIZE_PERCENTAGE_LINE=10
PRIZE_PERCENTAGE_QUADRA=15
PRIZE_PERCENTAGE_BINGO=50
PRIZE_PERCENTAGE_ACCUMULATED=25
```

---

## ✅ Checklist de Variáveis

- [ ] `PORT` configurada
- [ ] `NODE_ENV` = `production`
- [ ] `DB_HOST` do PlanetScale/AWS/DigitalOcean
- [ ] `DB_USER` e `DB_PASSWORD` corretos
- [ ] `DB_NAME` = `bingo_master_lite`
- [ ] `JWT_SECRET` com 32+ caracteres aleatórios
- [ ] `PIX_KEY` com sua chave PIX real
- [ ] `WHATSAPP_SUPPORT_NUMBER` com seu número
- [ ] `CORS_ORIGIN` com URL do Render
- [ ] Variáveis de premiação somam 100%

---

## 🔒 Dicas de Segurança

1. **Nunca commite `.env`** no Git
2. **Nunca compartilhe** `JWT_SECRET` ou `DB_PASSWORD`
3. **Use valores diferentes** em dev e produção
4. **Mude `JWT_SECRET`** regularmente
5. **Proteja `WHATSAPP_SUPPORT_NUMBER`** (pode receber spam)
6. **Valide todas as variáveis** antes de usar

---

## 🆘 Problemas Comuns

### "Variável não definida"
- Certifique-se de que está no `.env` (local) ou Render (produção)
- Verifique a ortografia exata

### "Erro de conexão ao banco"
- Verifique `DB_HOST`, `DB_USER`, `DB_PASSWORD`
- Certifique-se de que o banco está online

### "CORS error"
- Verifique se a URL está em `CORS_ORIGIN`
- Aguarde 1-2 minutos para as mudanças serem aplicadas

### "Token inválido"
- Verifique se `JWT_SECRET` é o mesmo em dev e produção
- Regenere o token fazendo login novamente

---

## 📞 Suporte

Para dúvidas sobre variáveis específicas, consulte:
- Render Docs: https://render.com/docs
- PlanetScale Docs: https://planetscale.com/docs
- Node.js Docs: https://nodejs.org/docs
