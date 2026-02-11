import { Router, Response } from 'express';
import { query } from '../config/database.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

/**
 * GET /api/v1/game/status
 * Obter status do sorteio atual
 */
router.get('/status', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const gameId = req.query.gameId as string;

    // Se não informar gameId, pegar o jogo em andamento
    let game: any;

    if (gameId) {
      const games = (await query(
        `SELECT * FROM games WHERE id = ? AND status IN ('running', 'paused')`,
        [gameId]
      )) as any[];
      game = games[0];
    } else {
      const games = (await query(
        `SELECT * FROM games 
         WHERE status IN ('running', 'paused')
         ORDER BY actual_start DESC LIMIT 1`
      )) as any[];
      game = games[0];
    }

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Nenhum jogo em andamento',
      });
    }

    // Buscar cartelas do usuário neste jogo
    const userCards = (await query(
      `SELECT * FROM cards WHERE user_id = ? AND game_id = ?`,
      [userId, game.id]
    )) as any[];

    // Buscar prêmios já concedidos
    const prizes = (await query(
      `SELECT * FROM prizes WHERE game_id = ? ORDER BY created_at DESC`,
      [game.id]
    )) as any[];

    // Retornar status
    res.json({
      success: true,
      game: {
        id: game.id,
        title: game.title,
        status: game.status,
        currentNumber: game.current_number,
        drawnNumbers: JSON.parse(game.drawn_numbers || '[]'),
        narration: game.narration_during || '',
        totalRaised: parseFloat(game.total_raised),
      },
      prizes: {
        line: parseFloat(game.prize_line),
        quadra: parseFloat(game.prize_quadra),
        bingo: parseFloat(game.prize_bingo),
        accumulated: parseFloat(game.prize_accumulated),
        totalAccumulated: parseFloat(game.accumulated_from_previous) + parseFloat(game.prize_accumulated),
      },
      userCards: userCards.map((c: any) => ({
        id: c.id,
        seriesNumber: c.series_number,
        cardNumber: c.card_number,
        numbers: JSON.parse(c.numbers),
        markedNumbers: JSON.parse(c.marked_numbers || '[]'),
        status: c.status,
      })),
      recentPrizes: prizes.slice(0, 5).map((p: any) => ({
        id: p.id,
        userName: p.user_id, // Será preenchido com nome real em produção
        prizeType: p.prize_type,
        amount: parseFloat(p.amount),
        ballsDrawn: p.balls_drawn,
        narration: p.narration,
      })),
    });
  } catch (error) {
    console.error('Erro ao obter status do jogo:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao obter status do jogo',
    });
  }
});

/**
 * GET /api/v1/game/list
 * Listar jogos disponíveis
 */
router.get('/list', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const games = (await query(
      `SELECT id, title, description, status, scheduled_start, 
              total_raised, prize_line, prize_quadra, prize_bingo, prize_accumulated
       FROM games 
       WHERE status IN ('scheduled', 'running', 'paused')
       ORDER BY scheduled_start DESC
       LIMIT 10`
    )) as any[];

    res.json({
      success: true,
      games: games.map((g: any) => ({
        id: g.id,
        title: g.title,
        description: g.description,
        status: g.status,
        scheduledStart: g.scheduled_start,
        totalRaised: parseFloat(g.total_raised),
        prizes: {
          line: parseFloat(g.prize_line),
          quadra: parseFloat(g.prize_quadra),
          bingo: parseFloat(g.prize_bingo),
          accumulated: parseFloat(g.prize_accumulated),
        },
      })),
    });
  } catch (error) {
    console.error('Erro ao listar jogos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao listar jogos',
    });
  }
});

/**
 * POST /api/v1/game/mark-number
 * Marcar número na cartela (normalmente feito automaticamente pelo servidor)
 */
router.post('/mark-number', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { cardId, number } = req.body;

    if (!cardId || !number) {
      return res.status(400).json({
        success: false,
        message: 'cardId e number são obrigatórios',
      });
    }

    // Buscar cartela
    const cards = (await query(
      'SELECT * FROM cards WHERE id = ? AND user_id = ?',
      [cardId, req.userId]
    )) as any[];

    if (cards.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cartela não encontrada',
      });
    }

    const card = cards[0];
    const markedNumbers = JSON.parse(card.marked_numbers || '[]');

    if (!markedNumbers.includes(number)) {
      markedNumbers.push(number);
    }

    // Atualizar cartela
    await query(
      'UPDATE cards SET marked_numbers = ? WHERE id = ?',
      [JSON.stringify(markedNumbers), cardId]
    );

    res.json({
      success: true,
      markedNumbers,
    });
  } catch (error) {
    console.error('Erro ao marcar número:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao marcar número',
    });
  }
});

export default router;
