// Rotas de Autenticação
import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { generateToken, authMiddleware } from '../middleware/auth.middleware';
import { logger } from '../lib/logger';
import { z } from 'zod';

const router = Router();

// Schema de validação
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

// ==========================================
// CREDENCIAIS DE ADMIN (Hardcoded por segurança)
// Em produção, use banco de dados
// ==========================================

const ADMIN_CREDENTIALS = {
  email: process.env.ADMIN_EMAIL || 'admin@oletv.com',
  // Hash de "admin123" - mude em produção!
  passwordHash: process.env.ADMIN_PASSWORD_HASH || '$2a$10$JZ8M8AHFjL5H6VGEKjj8YuKg8f4cYf7QXsNK.G2oIH1cWJhJ8pF6.',
  userId: 'admin-user-id',
};

// ==========================================
// LOGIN
// ==========================================

/**
 * POST /auth/login
 * Autentica usuário e retorna token JWT
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    // Valida dados de entrada
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        details: validation.error.errors,
      });
    }

    const { email, password } = validation.data;

    // Verifica credenciais
    if (email !== ADMIN_CREDENTIALS.email) {
      logger.warn('Tentativa de login com email não autorizado', { email });
      return res.status(401).json({
        success: false,
        error: 'Credenciais inválidas',
      });
    }

    // Verifica senha
    const isValidPassword = await bcrypt.compare(password, ADMIN_CREDENTIALS.passwordHash);
    if (!isValidPassword) {
      logger.warn('Tentativa de login com senha incorreta', { email });
      return res.status(401).json({
        success: false,
        error: 'Credenciais inválidas',
      });
    }

    // Gera token
    const token = generateToken(ADMIN_CREDENTIALS.userId, email);

    logger.info('Login realizado com sucesso', { email });

    return res.json({
      success: true,
      data: {
        token,
        user: {
          id: ADMIN_CREDENTIALS.userId,
          email,
          role: 'admin',
        },
        expiresIn: '7d',
      },
    });
  } catch (error: any) {
    logger.error('Erro no login', { error: error.message });
    return res.status(500).json({
      success: false,
      error: 'Erro interno no servidor',
    });
  }
});

// ==========================================
// VERIFICAR TOKEN
// ==========================================

/**
 * GET /auth/verify
 * Verifica se o token é válido
 */
router.get('/verify', authMiddleware, async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const userEmail = (req as any).userEmail;

  return res.json({
    success: true,
    data: {
      userId,
      email: userEmail,
      role: 'admin',
    },
  });
});

// ==========================================
// LOGOUT (Informativo)
// ==========================================

/**
 * POST /auth/logout
 * Apenas para registro - o token deve ser removido no client
 */
router.post('/logout', authMiddleware, async (req: Request, res: Response) => {
  const userEmail = (req as any).userEmail;
  logger.info('Logout realizado', { email: userEmail });

  return res.json({
    success: true,
    message: 'Logout realizado. Remova o token do cliente.',
  });
});

// ==========================================
// GERAR HASH (Utilitário para criar senhas)
// ==========================================

/**
 * POST /auth/hash
 * Gera hash bcrypt de uma senha (apenas em desenvolvimento)
 */
router.post('/hash', async (req: Request, res: Response) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ success: false, error: 'Não disponível em produção' });
  }

  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ success: false, error: 'Password obrigatório' });
  }

  const hash = await bcrypt.hash(password, 10);
  return res.json({ success: true, hash });
});

export default router;
