// src/routes/dispositivo.routes.ts

import { Router } from "express";
import DispositivoController from "../controllers/DispositivoController";

const dispositivoRoutes = Router();
const controller = new DispositivoController();

dispositivoRoutes.post("/", controller.create);
dispositivoRoutes.get("/", controller.findAll);
dispositivoRoutes.get("/:id_dispositivo", controller.findOne);
dispositivoRoutes.put("/:id_dispositivo", controller.update);
dispositivoRoutes.delete("/:id_dispositivo", controller.delete);

export default dispositivoRoutes;