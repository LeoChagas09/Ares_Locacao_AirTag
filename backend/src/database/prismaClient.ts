// src/database/prismaClient.ts
import { PrismaClient } from '@prisma/client';

// Cria uma instância do PrismaClient
const prismaClient = new PrismaClient();

// Exporta a instância para que possamos usá-la em outras partes do código
export default prismaClient;