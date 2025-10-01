// src/controllers/DispositivoController.ts

import { Request, Response, NextFunction } from "express";
import DispositivoService from "../services/DispositivoService";
import prismaClient from "../database/prismaClient";
import { validar } from "../utils/validations";

class DispositivoController {
  private readonly dispositivoService: DispositivoService;

  constructor() {
    this.dispositivoService = new DispositivoService(prismaClient);
    this.create = this.create.bind(this);
    this.findAll = this.findAll.bind(this);
    this.findOne = this.findOne.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async create(request: Request, response: Response, next: NextFunction) {
    try {
      // Valida e transforma os dados automaticamente com Zod
      const dadosValidados = validar.dispositivo(request.body);
      
      const dispositivo = await this.dispositivoService.create(dadosValidados);
      return response.status(201).json({
        sucesso: true,
        dados: dispositivo,
        mensagem: "Dispositivo criado com sucesso"
      });
    } catch (error) {
      next(error);
    }
  };

  async findAll(request: Request, response: Response, next: NextFunction) {
    try {
      const dispositivos = await this.dispositivoService.findAll();
      return response.status(200).json(dispositivos);
    } catch (error) {
      next(error);
    }
  };

  async findOne(request: Request, response: Response, next: NextFunction){
    try {
      const { id_dispositivo } = request.params;
      const dispositivo = await this.dispositivoService.findOne(id_dispositivo);
      return response.status(200).json(dispositivo);
    } catch (error) {
      next(error);
    }
  };

  async update(request: Request, response: Response, next: NextFunction){
    try {
      const { id_dispositivo } = request.params;
      
      // Valida os dados com Zod
      const dadosValidados = validar.dispositivo(request.body);

      const dispositivo = await this.dispositivoService.update(id_dispositivo, dadosValidados);
      return response.status(200).json({
        sucesso: true,
        dados: dispositivo,
        mensagem: "Dispositivo atualizado com sucesso"
      });
    } catch (error) {
      next(error);
    }
  };

  async delete(request: Request, response: Response, next: NextFunction){
    try {
      const { id_dispositivo } = request.params;
      await this.dispositivoService.delete(id_dispositivo);
      return response.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

export default DispositivoController;