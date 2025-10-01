// src/utils/errors.ts

// Classe simples para erros da API
export class APIError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'APIError';
  }
}

// Funções auxiliares para criar erros específicos
export const ErrorTypes = {
  // 400 - Dados inválidos
  badRequest: (message: string) => new APIError(message, 400),
  
  // 404 - Não encontrado
  notFound: (resource: string) => new APIError(`${resource} não encontrado`, 404),
  
  // 409 - Conflito (já existe)
  conflict: (message: string) => new APIError(message, 409),
  
  // 500 - Erro interno
  internal: (message: string = 'Erro interno do servidor') => new APIError(message, 500)
};