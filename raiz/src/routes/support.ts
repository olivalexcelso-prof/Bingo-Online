import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/database.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

/**
 * POST /api/v1/support/send
 * Enviar mensagem de suporte (máximo 30 palavras)
 */
router.post('/send', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Mensagem não pode estar vazia',
      });
    }

    // Contar palavras
    const wordCount = message.trim().split(/\s+/).length;

    if (wordCount > 30) {
      return res.status(400).json({
        success: false,
        message: `Mensagem excede o limite de 30 palavras (${wordCount} palavras)`,
      });
    }

    // Buscar dados do usuário
    const users = (await query(
      'SELECT name, whatsapp FROM users WHERE id = ?',
      [req.userId]
    )) as any[];

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado',
      });
    }

    const user = users[0];

    // Criar mensagem de suporte
    const messageId = uuidv4();
    await query(
      `INSERT INTO support_messages (id, user_id, message, word_count, status)
       VALUES (?, ?, ?, ?, ?)`,
      [messageId, req.userId, message, wordCount, 'open']
    );

    // Preparar mensagem para WhatsApp
    const whatsappMessage = `Mensagem de suporte de ${user.name}:\n\n${message}\n\nContato: ${user.whatsapp}`;

    // Aqui você integraria com a API do WhatsApp para enviar a mensagem
    // Por enquanto, apenas retornamos sucesso

    res.json({
      success: true,
      messageId,
      wordCount,
      message: 'Mensagem enviada com sucesso. Você receberá uma resposta no WhatsApp em breve.',
      whatsappUrl: `https://wa.me/${process.env.WHATSAPP_SUPPORT_NUMBER || '5511999999999'}?text=${encodeURIComponent(whatsappMessage)}`,
    });
  } catch (error) {
    console.error('Erro ao enviar mensagem de suporte:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao enviar mensagem de suporte',
    });
  }
});

/**
 * GET /api/v1/support/messages
 * Listar mensagens de suporte do usuário
 */
router.get('/messages', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const messages = (await query(
      `SELECT * FROM support_messages WHERE user_id = ? ORDER BY created_at DESC LIMIT 10`,
      [req.userId]
    )) as any[];

    res.json({
      success: true,
      messages: messages.map((m: any) => ({
        id: m.id,
        message: m.message,
        wordCount: m.word_count,
        response: m.response,
        status: m.status,
        createdAt: m.created_at,
        respondedAt: m.responded_at,
      })),
    });
  } catch (error) {
    console.error('Erro ao listar mensagens:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao listar mensagens',
    });
  }
});

export default router;
