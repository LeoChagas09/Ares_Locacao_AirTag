// src/server.ts
import express from 'express';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import cors from 'cors';

// Inicia a aplicação Express
const app = express();

// Define a porta do servidor
const PORT = process.env.PORT || 3333;

app.use(cors());
// Middleware para entender JSON
app.use(express.json());

// Rotas da aplicação
app.use(routes);

// ⭐ Middleware de tratamento de erros (sempre por último!)
app.use(errorHandler);

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});