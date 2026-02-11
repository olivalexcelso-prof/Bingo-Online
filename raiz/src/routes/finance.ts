import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query, transaction } from '../config/database.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

/**
 * GET /api/v1/finance/balance
 * Obter saldo do usuário
 */
router.get('/balance', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const users = (await query(
      'SELECT balance FROM users WHERE id = ?',
      [req.userId]
    )) as any[];

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado',
      });
    }

    res.json({
      success: true,
      balance: parseFloat(users[0].balance),
    });
  } catch (error) {
    console.error('Erro ao obter saldo:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao obter saldo',
    });
  }
});

/**
 * POST /api/v1/finance/deposit
 * Registrar solicitação de depósito
 */
router.post('/deposit', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valor deve ser maior que zero',
      });
    }

    const transactionId = uuidv4();

    // Criar transação pendente
    await query(
      `INSERT INTO transactions (id, user_id, type, amount, status, description)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [transactionId, req.userId, 'deposit', amount, 'pending', 'Depósito via PIX']
    );

    // Retornar dados para o cliente exibir QR code/chave PIX
    res.json({
      success: true,
      transactionId,
      pixKey: process.env.PIX_KEY || 'chave-pix-bingo@banco.com',
      pixBank: process.env.PIX_BANK || 'Banco do Bingo',
      amount,
      message: 'Escaneie o QR code ou copie a chave PIX para fazer o depósito',
    });
  } catch (error) {
    console.error('Erro ao criar depósito:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar depósito',
    });
  }
});

/**
 * GET /api/v1/finance/deposit/:transactionId
 * Verificar status do depósito
 */
router.get('/deposit/:transactionId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { transactionId } = req.params;

    const transactions = (await query(
      'SELECT * FROM transactions WHERE id = ? AND user_id = ?',
      [transactionId, req.userId]
    )) as any[];

    if (transactions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Transação não encontrada',
      });
    }

    const transaction = transactions[0];

    res.json({
      success: true,
      transactionId: transaction.id,
      status: transaction.status,
      amount: parseFloat(transaction.amount),
      confirmed: transaction.status === 'confirmed',
      confirmedAt: transaction.confirmed_at,
    });
  } catch (error) {
    console.error('Erro ao verificar depósito:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao verificar depósito',
    });
  }
});

/**
 * POST /api/v1/finance/withdraw
 * Solicitar saque
 */
router.post('/withdraw', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { amount, pixKey } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valor deve ser maior que zero',
      });
    }

    if (!pixKey) {
      return res.status(400).json({
        success: false,
        message: 'Chave PIX é obrigatória',
      });
    }

    // Verificar saldo
    const users = (await query(
      'SELECT balance FROM users WHERE id = ?',
      [req.userId]
    )) as any[];

    if (users.length === 0 || parseFloat(users[0].balance) < amount) {
      return res.status(400).json({
        success: false,
        message: 'Saldo insuficiente',
      });
    }

    // Criar solicitação de saque
    const withdrawalId = uuidv4();
    await query(
      `INSERT INTO withdrawal_requests (id, user_id, amount, pix_key, status)
       VALUES (?, ?, ?, ?, ?)`,
      [withdrawalId, req.userId, amount, pixKey, 'pending']
    );

    // Criar transação
    const transactionId = uuidv4();
    await query(
      `INSERT INTO transactions (id, user_id, type, amount, status, description, pix_key)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [transactionId, req.userId, 'withdrawal', amount, 'pending', 'Saque solicitado', pixKey]
    );

    res.json({
      success: true,
      withdrawalId,
      transactionId,
      status: 'pending',
      message: 'Saque solicitado com sucesso. Você receberá uma confirmação no WhatsApp.',
    });
  } catch (error) {
    console.error('Erro ao solicitar saque:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao solicitar saque',
    });
  }
});

/**
 * GET /api/v1/finance/transactions
 * Listar transações do usuário
 */
router.get('/transactions', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const transactions = (await query(
      `SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 20`,
      [req.userId]
    )) as any[];

    res.json({
      success: true,
      transactions: transactions.map((t: any) => ({
        id: t.id,
        type: t.type,
        amount: parseFloat(t.amount),
        status: t.status,
        description: t.description,
        createdAt: t.created_at,
        confirmedAt: t.confirmed_at,
      })),
    });
  } catch (error) {
    console.error('Erro ao listar transações:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao listar transações',
    });
  }
});

export default router;
