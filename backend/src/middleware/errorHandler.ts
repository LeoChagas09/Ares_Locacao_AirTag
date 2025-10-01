// src/middleware/errorHandler.ts

import { Request, Response, NextFunction } from 'express';
import { APIError } from '../utils/errors';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('🔴 Erro capturado:', error.message);

  // Se é um erro da nossa API
  if (error instanceof APIError) {
    return res.status(error.statusCode).json({
      erro: true,
      mensagem: error.message,
      codigo: error.statusCode
    });
  }

  // Trata erros comuns do Prisma
  if (error.code === 'P2002') {
    return res.status(409).json({
      erro: true,
      mensagem: 'Este registro já existe',
      codigo: 409
    });
  }

  if (error.code === 'P2025') {
    return res.status(404).json({
      erro: true,
      mensagem: 'Registro não encontrado',
      codigo: 404
    });
  }

  // Erro genérico
  return res.status(500).json({
    erro: true,
    mensagem: 'Erro interno do servidor',
    codigo: 500
  });
};