# Base image
FROM node:18.12 AS builder

# Diretório de trabalho
WORKDIR /usr/src/app

# Instala o npm globalmente e limpa o cache de dependências
RUN npm install -g npm && \
  npm cache clean --force

# Copia os arquivos de configuração e as dependências do projeto
COPY package*.json ./

COPY ./src/shared/infra/prisma/schema.prisma ./schema.prisma

# Instala as dependências do projeto
RUN npm ci

# Copia os arquivos do aplicativo para o diretório de trabalho
COPY . .

# Construir o aplicativo
RUN npm run prisma:generate
RUN npm run build:webpack

# --- Segunda etapa - criar imagem final apenas com arquivos necessários ---

# Base image
FROM node:18.12-alpine

# Diretório de trabalho
WORKDIR /usr/src/app

# Copia os arquivos de configuração e as dependências do projeto
COPY package*.json ./

# Copia os arquivos construídos na primeira etapa
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/ecosystem.config.js ./ecosystem.config.js
COPY --from=builder /usr/src/app/schema.prisma ./src/shared/infra/prisma/schema.prisma

# Instala as dependências do projeto
RUN npm ci --only=production

# Prisma procedures
RUN npm run prisma:generate:types
RUN npm run prisma:generate:migration
RUN npm run prisma:migrate

# Expor a porta do aplicativo
EXPOSE $PORT

# Iniciar o aplicativo
CMD ["npm", "start" ]
