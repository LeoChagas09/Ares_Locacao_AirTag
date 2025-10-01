// src/utils/validations.ts

import { z } from 'zod';
import { ErrorTypes } from './errors';

// ===== SCHEMAS DE VALIDAÇÃO =====

export const clienteSchema = z.object({
  nome: z
    .string({
      message: "Nome é obrigatório"
    })
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(255, "Nome deve ter no máximo 255 caracteres")
    .trim(),
    
  email: z
    .email({
      message: "Email deve ter um formato válido"
    })
    .toLowerCase()
    .trim()
});

export const dispositivoSchema = z.object({
  nome: z
    .string({
      message: "Nome é obrigatório"
    })
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(255, "Nome deve ter no máximo 255 caracteres")
    .trim(),
    
  macAddress: z
    .string({
      message: "MAC Address é obrigatório"
    })
    .regex(
      /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,
      "MAC Address deve estar no formato XX:XX:XX:XX:XX:XX ou XX-XX-XX-XX-XX-XX"
    )
    .transform(mac => mac.toUpperCase())
});

export const locacaoSchema = z.object({
  clienteId: z
    .string({
      message: "ID do cliente é obrigatório"
    })
    .min(1, "ID do cliente não pode estar vazio"),
    
  dispositivoId: z
    .string({
      message: "ID do dispositivo é obrigatório"
    })
    .min(1, "ID do dispositivo não pode estar vazio")
});

// ===== FUNÇÃO HELPER PARA VALIDAR =====

export const validar = {
  // Valida dados do cliente
  cliente: (dados: unknown) => {
    try {
      return clienteSchema.parse(dados);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const mensagem = error.issues.map(err => err.message).join(', ');
        throw ErrorTypes.badRequest(mensagem);
      }
      throw error;
    }
  },

  // Valida dados do dispositivo
  dispositivo: (dados: unknown) => {
    try {
      return dispositivoSchema.parse(dados);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const mensagem = error.issues.map(err => err.message).join(', ');
        throw ErrorTypes.badRequest(mensagem);
      }
      throw error;
    }
  },

  // Valida dados da locação
  locacao: (dados: unknown) => {
    try {
      return locacaoSchema.parse(dados);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const mensagem = error.issues.map(err => err.message).join(', ');
        throw ErrorTypes.badRequest(mensagem);
      }
      throw error;
    }
  }
};

// ===== TIPOS TYPESCRIPT GERADOS AUTOMATICAMENTE =====

export type ClienteInput = z.infer<typeof clienteSchema>;
export type DispositivoInput = z.infer<typeof dispositivoSchema>;
export type LocacaoInput = z.infer<typeof locacaoSchema>;