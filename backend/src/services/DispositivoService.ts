// src/services/DispositivoService.ts

import { PrismaClient } from "@prisma/client";
import ShortUniqueId from "short-unique-id";
import { ErrorTypes } from "../utils/errors";
import { DispositivoInput } from "../utils/validations";

class DispositivoService {
  constructor(private readonly prisma: PrismaClient) {}

  async create({ nome, macAddress }: DispositivoInput) {
    const { randomUUID } = new ShortUniqueId({
      dictionary: "hex",
      length: 32,
    });
    const id_dispositivo = randomUUID();

    
    const dispositivoJaExiste = await this.prisma.dispositivo.findUnique({
      where: { macAddress },
    });

    if (dispositivoJaExiste) {
      throw ErrorTypes.conflict("Já existe um dispositivo com este MAC Address");
    }

    const dispositivo = await this.prisma.dispositivo.create({
      data: {
        id_dispositivo,
        nome,
        macAddress,
      },
    });

    return dispositivo;
  }

  async findAll() {
    return this.prisma.dispositivo.findMany();
  }

  async findOne(id_dispositivo: string) {
    const dispositivo = await this.prisma.dispositivo.findUnique({
      where: { id_dispositivo },
    });

    if (!dispositivo) {
      throw ErrorTypes.notFound("Dispositivo");
    }

    return dispositivo;
  }

  async update(id_dispositivo: string, { nome, macAddress }: DispositivoInput) {
    const dispositivoExiste = await this.prisma.dispositivo.findUnique({
      where: { id_dispositivo }
    });

    if (!dispositivoExiste) {
      throw ErrorTypes.notFound("Dispositivo");
    }

    const macJaUsado = await this.prisma.dispositivo.findFirst({
      where: { 
        macAddress,
        NOT: { id_dispositivo }
      },
    });

    if (macJaUsado) {
      throw ErrorTypes.conflict("Este MAC Address já está sendo usado por outro dispositivo");
    }

    const dispositivoAtualizado = await this.prisma.dispositivo.update({
      where: { id_dispositivo },
      data: { 
        nome,
        macAddress
      },
    });

    return dispositivoAtualizado;
  }

  async delete(id_dispositivo: string) {
    const dispositivoExiste = await this.prisma.dispositivo.findUnique({
      where: { id_dispositivo }
    });

    if (!dispositivoExiste) {
      throw ErrorTypes.notFound("Dispositivo");
    }

    // Verifica se tem locações ativas
    const temLocacoesAtivas = await this.prisma.locacao.findFirst({
      where: { 
        dispositivoId: id_dispositivo,
        dataFim: null
      },
    });

    if (temLocacoesAtivas) {
      throw ErrorTypes.conflict("Não é possível deletar dispositivo com locações ativas");
    }

    await this.prisma.dispositivo.delete({ 
      where: { id_dispositivo }
    });

    return { message: "Dispositivo deletado com sucesso" };
  }
}

export default DispositivoService;