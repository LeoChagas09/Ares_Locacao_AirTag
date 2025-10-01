// src/routes/cliente.routes.ts
import { Router } from "express";
import ClienteController from "../controllers/ClienteController";

const clienteRoutes = Router();
const controller = new ClienteController();

// Rota para CRIAR um novo cliente
clienteRoutes.post("/", controller.create);

// Rota para LISTAR TODOS os clientes
clienteRoutes.get("/", controller.findAll);

// Rota para BUSCAR UM cliente pelo ID
clienteRoutes.get("/:id_cliente", controller.findOne);

// Rota para ATUALIZAR um cliente pelo ID
clienteRoutes.put("/:id_cliente", controller.update);

// Rota para DELETAR um cliente pelo ID
clienteRoutes.delete("/:id_cliente", controller.delete);

export default clienteRoutes;