# Base image
FROM node:latest

# Diretório de trabalho
WORKDIR /usr/src/app

# Instala o npm globalmente e limpa o cache de dependências
RUN npm install -g npm && \
  npm cache clean --force

# Copia os arquivos de configuração e as dependências do projeto
COPY package*.json ./
RUN npm install

# Copia os arquivos do aplicativo para o diretório de trabalho
COPY . .

# Expor a porta do aplicativo
EXPOSE $PORT

# Iniciar o aplicativo
CMD [ "npm", "start" ]
