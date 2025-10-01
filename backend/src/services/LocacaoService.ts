// src/services/LocacaoService.ts

import { PrismaClient } from "@prisma/client";
import ShortUniqueId from "short-unique-id";
import { ErrorTypes } from "../utils/errors";
import { LocacaoInput } from "../utils/validations";

const PRECO_POR_MINUTO = 0.52;

class LocacaoService {
  constructor(private readonly prisma: PrismaClient) {}

  async iniciar({ clienteId, dispositivoId }: LocacaoInput) {
    const cliente = await this.prisma.cliente.findUnique({ 
      where: { id_cliente: clienteId } 
    });
    
    if (!cliente) {
      throw ErrorTypes.notFound("Cliente");
    }

    const dispositivo = await this.prisma.dispositivo.findUnique({ 
      where: { id_dispositivo: dispositivoId } 
    });
    
    if (!dispositivo) {
      throw ErrorTypes.notFound("Dispositivo");
    }

    const { randomUUID } = new ShortUniqueId({
      dictionary: "hex",
      length: 32,
    });
    const id_locacao = randomUUID();

    // 2. REGRA DE NEGÓCIO: Verificar se o dispositivo já está alugado
    const dispositivoAlugado = await this.prisma.locacao.findFirst({
      where: {
        dispositivoId: dispositivoId,
        dataFim: null, // Procura por locações ativas
      },
    });

    if (dispositivoAlugado) {
      throw ErrorTypes.conflict("Este dispositivo já está alugado");
    }

    const novaLocacao = await this.prisma.locacao.create({
      data: {
        id_locacao, 
        clienteId,
        dispositivoId,
      },
      include: {
        cliente: {
          select: { nome: true, email: true }
        },
        dispositivo: {
          select: { nome: true, macAddress: true }
        }
      }
    });

    return novaLocacao;
  }

  async finalizar(locacaoId: string) {
    // 1. Busca a locação para garantir que ela existe e está ativa
    const locacaoAtiva = await this.prisma.locacao.findFirst({
      where: {
        id_locacao: locacaoId,
        dataFim: null, // Só podemos finalizar locações ativas
      },
      include: {
        cliente: {
          select: { nome: true, email: true }
        },
        dispositivo: {
          select: { nome: true, macAddress: true }
        }
      }
    });

    if (!locacaoAtiva) {
      throw ErrorTypes.notFound("Locação ativa");
    }

    // 2. CÁLCULO DO CUSTO:
    const dataFim = new Date();
    const dataInicio = locacaoAtiva.dataInicio;
    
    // Diferença em milissegundos
    const diffMs = dataFim.getTime() - dataInicio.getTime();
    
    // Converte para minutos e arredonda para cima (mínimo de 1 minuto)
    const minutosTotais = Math.max(1, Math.ceil(diffMs / (1000 * 60)));
    
    const custoTotal = Number((minutosTotais * PRECO_POR_MINUTO).toFixed(2));

    // 3. Atualiza a locação com a data de fim e o custo
    const locacaoFinalizada = await this.prisma.locacao.update({
      where: {
        id_locacao: locacaoId,
      },
      data: {
        dataFim: dataFim,
        custoTotal: custoTotal,
      },
      include: {
        cliente: {
          select: { nome: true, email: true }
        },
        dispositivo: {
          select: { nome: true, macAddress: true }
        }
      }
    });

    return {
      ...locacaoFinalizada,
      tempoTotalMinutos: minutosTotais,
      precoPorMinuto: PRECO_POR_MINUTO
    };
  }

  async findAll() {
    return this.prisma.locacao.findMany({
      // O 'include' traz os dados relacionados
      include: {
        cliente: true,
        dispositivo: true,
      },
      // Ordena pelas mais recentes primeiro
      orderBy: {
        dataInicio: 'desc',
      }
    });
  }
}

export default LocacaoService;