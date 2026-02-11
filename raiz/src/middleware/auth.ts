import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export interface AuthRequest extends Request {
  userId?: string;
  user?: any;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token não fornecido',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.userId = (decoded as any).userId;
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido ou expirado',
    });
  }
};

export const generateToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    (process.env.JWT_SECRET || 'secret') as string,
    { expiresIn: process.env.JWT_EXPIRE || '7d' } as any
  );
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, (process.env.JWT_SECRET || 'secret') as string);
  } catch (error) {
    return null;
  }
};
