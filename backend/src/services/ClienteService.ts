// src/services/ClienteService.ts
import { PrismaClient } from "@prisma/client";
import ShortUniqueId from "short-unique-id";
import { ErrorTypes } from "../utils/errors";
import { ClienteInput } from "../utils/validations";

class ClienteService {
  constructor(private readonly prisma: PrismaClient) {}

  async create({ nome, email }: ClienteInput) {
    const { randomUUID } = new ShortUniqueId({
      dictionary: "hex",
      length: 32,
    });
    const id_cliente = randomUUID();
    
    
    const clienteJaExiste = await this.prisma.cliente.findFirst({
      where: { email }, 
    });

    if (clienteJaExiste) {
      throw ErrorTypes.conflict("Já existe um cliente com este e-mail");
    }

    const cliente = await this.prisma.cliente.create({
      data: {
        id_cliente,
        nome,
        email,
      },
    });

    return cliente;
  }

  async findAll() {
    const clientes = await this.prisma.cliente.findMany();
    return clientes;
  }
  
  async findOne(id_cliente: string) {
    const cliente = await this.prisma.cliente.findUnique({
      where: { id_cliente },
    });

    if (!cliente) {
      throw ErrorTypes.notFound("Cliente");
    }
    
    return cliente;
  }

  async update(id_cliente: string, { nome, email }: ClienteInput) {
    const clienteExiste = await this.prisma.cliente.findUnique({
      where: { id_cliente },
    });

    if (!clienteExiste) {
      throw ErrorTypes.notFound("Cliente");
    }

    const emailJaUsado = await this.prisma.cliente.findFirst({
      where: { 
        email,
        NOT: { id_cliente }
      },
    });

    if (emailJaUsado) {
      throw ErrorTypes.conflict("Este email já está sendo usado por outro cliente");
    }
    
    const clienteAtualizado = await this.prisma.cliente.update({
      where: { id_cliente },
      data: { 
        nome,
        email 
      },
    });
    
    return clienteAtualizado;
  }

  async delete(id_cliente: string) {
    const clienteExiste = await this.prisma.cliente.findUnique({
      where: { id_cliente },
    });

    if (!clienteExiste) {
      throw ErrorTypes.notFound("Cliente");
    }

    // Verifica se tem locações ativas
    const temLocacoesAtivas = await this.prisma.locacao.findFirst({
      where: { 
        clienteId: id_cliente,
        dataFim: null
      },
    });

    if (temLocacoesAtivas) {
      throw ErrorTypes.conflict("Não é possível deletar cliente com locações ativas");
    }

    await this.prisma.cliente.delete({
      where: { id_cliente },
    });

    return { message: "Cliente deletado com sucesso" };
  }
}

export default ClienteService;