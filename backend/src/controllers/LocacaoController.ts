// src/controllers/LocacaoController.ts

import { Request, Response, NextFunction } from "express";
import LocacaoService from "../services/LocacaoService";
import prismaClient from "../database/prismaClient";
import { validar } from "../utils/validations";

class LocacaoController {
  private readonly locacaoService: LocacaoService;

  constructor() {
    this.locacaoService = new LocacaoService(prismaClient);
    this.iniciar = this.iniciar.bind(this);
    this.finalizar = this.finalizar.bind(this);
    this.findAll = this.findAll.bind(this);
  }

  async iniciar(request: Request, response: Response, next: NextFunction) {
    try {
      // Valida os dados com Zod
      const dadosValidados = validar.locacao(request.body);
      
      const locacao = await this.locacaoService.iniciar(dadosValidados);
      return response.status(201).json({
        sucesso: true,
        dados: locacao,
        mensagem: "Locação iniciada com sucesso"
      });
    } catch (error) {
      next(error);
    }
  };

  async finalizar(request: Request, response: Response, next: NextFunction) {
    try {
      const { id_locacao } = request.params;
      const locacao = await this.locacaoService.finalizar(id_locacao);
      return response.status(200).json({
        sucesso: true,
        dados: locacao,
        mensagem: "Locação finalizada com sucesso"
      });
    } catch (error) {
      next(error);
    }
  };

  async findAll(request: Request, response: Response) {
    try {
      const locacoes = await this.locacaoService.findAll();
      return response.status(200).json(locacoes);
    } catch (error: any) {
      return response.status(400).json({ message: error.message });
    }
  }
}

export default LocacaoController;