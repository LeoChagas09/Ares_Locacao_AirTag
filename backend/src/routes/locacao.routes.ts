// src/routes/locacao.routes.ts

import { Router } from "express";
import LocacaoController from "../controllers/LocacaoController";

const locacaoRoutes = Router();
const controller = new LocacaoController();

locacaoRoutes.get("/", controller.findAll);
// Rota para iniciar uma nova locação
locacaoRoutes.post("/", controller.iniciar);

// Rota para finalizar uma locação existente
locacaoRoutes.patch("/:id_locacao/finalizar", controller.finalizar);

export default locacaoRoutes;