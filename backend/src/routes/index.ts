import { Router } from "express";
import clienteRoutes from "./cliente.routes";
import dispositivoRoutes from "./dispositivo.routes";
import locacaoRoutes from "./locacao.routes";

const routes = Router();

routes.use("/clientes", clienteRoutes);
routes.use("/dispositivos", dispositivoRoutes);
routes.use("/locacoes", locacaoRoutes);

export default routes;