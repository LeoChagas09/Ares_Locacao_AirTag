# Teste Ares/frontend/Dockerfile

# --- Estágio 1: Build da Aplicação ---
FROM node:20-alpine AS builder

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código da aplicação
COPY . .

# Define o argumento para a URL da API, que será passado pelo docker-compose
ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}

# Build da aplicação Next.js
RUN npm run build

# --- Estágio 2: Imagem de Produção ---
FROM node:20-alpine

WORKDIR /app

# Instala apenas o 'next' para rodar o servidor
COPY --from=builder /app/package*.json ./
RUN npm install --production next

# Copia os artefatos da build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.ts ./

# Expõe a porta do Next.js
EXPOSE 3000

# Comando para iniciar o servidor de produção
CMD ["npm", "start"]