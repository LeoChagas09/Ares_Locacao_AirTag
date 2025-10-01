// src/controllers/ClienteController.ts
import { Request, Response, NextFunction } from "express";
import ClienteService from "../services/ClienteService";
import prismaClient from "../database/prismaClient";
import { validar } from "../utils/validations";
import { ErrorTypes } from "../utils/errors";

class ClienteController {
  private readonly clienteService: ClienteService;

  constructor() {
    this.clienteService = new ClienteService(prismaClient);
    this.create = this.create.bind(this);
    this.findAll = this.findAll.bind(this);
    this.findOne = this.findOne.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async create(request: Request, response: Response, next: NextFunction) {
    try {
      // 1. Valida e transforma os dados automaticamente com Zod
      const dadosValidados = validar.cliente(request.body);

      // 2. Chama o service com dados já validados e transformados
      const cliente = await this.clienteService.create(dadosValidados);

      // 3. Resposta de sucesso padronizada
      return response.status(201).json({
        sucesso: true,
        dados: cliente,
        mensagem: 'Cliente criado com sucesso'
      });

    } catch (error) {
      // 4. Passa o erro para o middleware tratar
      next(error);
    }
  }
  
  async findAll(request: Request, response: Response, next: NextFunction) {
    try {
      const clientes = await this.clienteService.findAll();
      return response.status(200).json(clientes);
    } catch (error) {
      next(error);
    }
  }
  
  async findOne(request: Request, response: Response, next: NextFunction) {
    try {
      const { id_cliente } = request.params;
      const cliente = await this.clienteService.findOne(String(id_cliente));
      return response.status(200).json({
        sucesso: true,
        dados: cliente
      });
    } catch (error) {
      next(error);
    }
  }
  
  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const { id_cliente } = request.params;
      
      // Valida os dados com Zod
      const dadosValidados = validar.cliente(request.body);

      const cliente = await this.clienteService.update(String(id_cliente), dadosValidados);
      return response.status(200).json({
        sucesso: true,
        dados: cliente,
        mensagem: 'Cliente atualizado com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }
  
  async delete(request: Request, response: Response, next: NextFunction) {
    try {
      const { id_cliente } = request.params;
      await this.clienteService.delete(String(id_cliente));
      return response.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default ClienteController;