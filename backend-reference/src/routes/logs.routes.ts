// Rotas de Logs do Sistema
import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { logger } from '../lib/logger';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// ==========================================
// LISTAR LOGS DO SISTEMA
// ==========================================

/**
 * GET /logs
 * Lista logs do sistema com filtros e paginação
 */
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { 
      level, 
      source, 
      search,
      limit = '50', 
      offset = '0',
      startDate,
      endDate,
    } = req.query;

    // Busca integração do usuário
    const integration = await prisma.integration.findUnique({
      where: { userId },
    });

    if (!integration) {
      return res.status(404).json({
        success: false,
        error: 'Integração não encontrada',
      });
    }

    // Monta filtros
    const where: any = {
      OR: [
        { integrationId: integration.id },
        { integrationId: null }, // Logs globais também
      ],
    };

    if (level) where.level = level;
    if (source) where.source = source;
    if (search) {
      where.message = { contains: search as string, mode: 'insensitive' };
    }
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate as string);
      if (endDate) where.createdAt.lte = new Date(endDate as string);
    }

    const [logs, total] = await Promise.all([
      prisma.systemLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit as string),
        skip: parseInt(offset as string),
      }),
      prisma.systemLog.count({ where }),
    ]);

    return res.json({
      success: true,
      data: {
        logs,
        pagination: {
          total,
          limit: parseInt(limit as string),
          offset: parseInt(offset as string),
        },
      },
    });
  } catch (error: any) {
    logger.error('Erro ao listar logs', { error: error.message });
    return res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// ESTATÍSTICAS DE LOGS
// ==========================================

/**
 * GET /logs/stats
 * Retorna estatísticas dos logs
 */
router.get('/stats', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    
    const integration = await prisma.integration.findUnique({
      where: { userId },
    });

    if (!integration) {
      return res.status(404).json({ success: false, error: 'Integração não encontrada' });
    }

    // Últimas 24h
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [byLevel, bySource, total] = await Promise.all([
      prisma.systemLog.groupBy({
        by: ['level'],
        where: {
          OR: [{ integrationId: integration.id }, { integrationId: null }],
          createdAt: { gte: last24h },
        },
        _count: true,
      }),
      prisma.systemLog.groupBy({
        by: ['source'],
        where: {
          OR: [{ integrationId: integration.id }, { integrationId: null }],
          createdAt: { gte: last24h },
        },
        _count: true,
      }),
      prisma.systemLog.count({
        where: {
          OR: [{ integrationId: integration.id }, { integrationId: null }],
        },
      }),
    ]);

    return res.json({
      success: true,
      data: {
        byLevel: byLevel.map(r => ({ level: r.level, count: r._count })),
        bySource: bySource.map(r => ({ source: r.source, count: r._count })),
        total,
        period: '24h',
      },
    });
  } catch (error: any) {
    logger.error('Erro ao buscar stats de logs', { error: error.message });
    return res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// CRIAR LOG (para uso interno)
// ==========================================

/**
 * POST /logs
 * Cria um novo log no sistema
 */
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { level, source, message, details } = req.body;

    if (!source || !message) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios: source, message',
      });
    }

    const integration = await prisma.integration.findUnique({
      where: { userId },
    });

    const log = await prisma.systemLog.create({
      data: {
        integrationId: integration?.id,
        userId,
        level: level || 'INFO',
        source,
        message,
        details,
      },
    });

    return res.status(201).json({ success: true, data: log });
  } catch (error: any) {
    logger.error('Erro ao criar log', { error: error.message });
    return res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// LIMPAR LOGS ANTIGOS
// ==========================================

/**
 * DELETE /logs/cleanup
 * Remove logs antigos (mais de 30 dias)
 */
router.delete('/cleanup', authMiddleware, async (req: Request, res: Response) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const result = await prisma.systemLog.deleteMany({
      where: {
        createdAt: { lt: thirtyDaysAgo },
      },
    });

    return res.json({
      success: true,
      message: `${result.count} logs removidos`,
    });
  } catch (error: any) {
    logger.error('Erro ao limpar logs', { error: error.message });
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
