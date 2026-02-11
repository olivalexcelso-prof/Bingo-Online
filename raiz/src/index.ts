import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/database.js';

// Importar rotas
import authRoutes from './routes/auth.js';
import gameRoutes from './routes/game.js';
import financeRoutes from './routes/finance.js';
import supportRoutes from './routes/support.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
const corsOptions = {
  origin: (process.env.CORS_ORIGIN || 'http://localhost:3000').split(','),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/game', gameRoutes);
app.use('/api/v1/finance', financeRoutes);
app.use('/api/v1/support', supportRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada',
    path: req.path,
  });
});

// Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Iniciar servidor
async function startServer() {
  try {
    // Testar conexão com banco de dados
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error('❌ Falha ao conectar ao banco de dados');
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║        🎰 BINGO MASTER LITE - Servidor Backend 🎰         ║
║                                                            ║
║  Servidor iniciado com sucesso!                           ║
║  Porta: ${PORT}                                              ║
║  Ambiente: ${process.env.NODE_ENV || 'development'}                                  ║
║  URL: http://localhost:${PORT}                               ║
║                                                            ║
║  Endpoints disponíveis:                                   ║
║  - POST   /api/v1/auth/login                              ║
║  - POST   /api/v1/auth/register                           ║
║  - GET    /api/v1/game/status                             ║
║  - GET    /api/v1/finance/balance                         ║
║  - POST   /api/v1/finance/deposit                         ║
║  - POST   /api/v1/finance/withdraw                        ║
║  - POST   /api/v1/support/send                            ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

startServer();

export default app;
