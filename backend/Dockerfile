# Teste Ares/backend/Dockerfile

# --- Estágio 1: Build da Aplicação ---
FROM node:20-alpine AS builder

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências de produção e desenvolvimento
RUN npm install

# Copia o restante do código da aplicação
COPY . .

# Gera o cliente do Prisma
RUN npx prisma generate

# Compila o código TypeScript para JavaScript
RUN npm run build

# --- Estágio 2: Imagem de Produção ---
FROM node:20-alpine

WORKDIR /app

# Copia os arquivos de dependências novamente
COPY package*.json ./

# Instala APENAS as dependências de produção
RUN npm install --production

# Copia os artefatos da compilação do estágio de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

# Expõe a porta que a aplicação vai rodar
EXPOSE 3333

# Comando para iniciar a aplicação
CMD ["npm", "run", "start"]