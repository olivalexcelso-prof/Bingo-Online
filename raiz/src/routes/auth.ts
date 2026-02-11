import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcryptjs from 'bcryptjs';
import { query } from '../config/database.js';
import { generateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

/**
 * POST /api/v1/auth/login
 * Autenticar usuário com CPF e senha
 */
router.post('/login', async (req: AuthRequest, res: Response) => {
  try {
    const { user: cpf, password } = req.body;

    // Validar entrada
    if (!cpf || !password) {
      return res.status(400).json({
        success: false,
        message: 'CPF e senha são obrigatórios',
      });
    }

    // Buscar usuário
    const users = (await query(
      'SELECT * FROM users WHERE cpf = ?',
      [cpf]
    )) as any[];

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'CPF ou senha incorretos',
      });
    }

    const user = users[0];

    // Verificar senha
    const passwordMatch = await bcryptjs.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'CPF ou senha incorretos',
      });
    }

    // Verificar status
    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Usuário inativo ou bloqueado',
      });
    }

    // Buscar cartelas do usuário
    const cards = (await query(
      `SELECT c.* FROM cards c 
       INNER JOIN games g ON c.game_id = g.id 
       WHERE c.user_id = ? AND g.status IN ('running', 'paused')
       ORDER BY g.scheduled_start DESC`,
      [user.id]
    )) as any[];

    // Gerar token
    const token = generateToken(user.id);

    // Retornar dados
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        cpf: user.cpf,
        name: user.name,
        whatsapp: user.whatsapp,
        saldo: parseFloat(user.balance),
      },
      cards: cards.map((c: any) => ({
        id: c.id,
        seriesNumber: c.series_number,
        cardNumber: c.card_number,
        numbers: JSON.parse(c.numbers),
        markedNumbers: JSON.parse(c.marked_numbers || '[]'),
        status: c.status,
      })),
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao fazer login',
    });
  }
});

/**
 * POST /api/v1/auth/register
 * Registrar novo usuário
 */
router.post('/register', async (req: AuthRequest, res: Response) => {
  try {
    const { user: cpf, name, whatsapp, password } = req.body;

    // Validar entrada
    if (!cpf || !name || !whatsapp || !password) {
      return res.status(400).json({
        success: false,
        message: 'Todos os campos são obrigatórios',
      });
    }

    // Validar CPF (formato básico)
    if (!/^\d{11}$/.test(cpf)) {
      return res.status(400).json({
        success: false,
        message: 'CPF deve conter 11 dígitos',
      });
    }

    // Verificar se CPF já existe
    const existingUsers = (await query(
      'SELECT id FROM users WHERE cpf = ?',
      [cpf]
    )) as any[];

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'CPF já cadastrado',
      });
    }

    // Hash da senha
    const passwordHash = await bcryptjs.hash(password, 10);

    // Criar usuário
    const userId = uuidv4();
    await query(
      `INSERT INTO users (id, cpf, name, whatsapp, password_hash, balance, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, cpf, name, whatsapp, passwordHash, 0, 'active']
    );

    // Gerar token
    const token = generateToken(userId);

    // Retornar dados
    res.status(201).json({
      success: true,
      token,
      user: {
        id: userId,
        cpf,
        name,
        whatsapp,
        saldo: 0,
      },
      cards: [],
    });
  } catch (error) {
    console.error('Erro ao registrar:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao registrar usuário',
    });
  }
});

/**
 * POST /api/v1/auth/logout
 * Fazer logout (apenas para limpeza no cliente)
 */
router.post('/logout', (req: AuthRequest, res: Response) => {
  res.json({
    success: true,
    message: 'Logout realizado com sucesso',
  });
});

export default router;
