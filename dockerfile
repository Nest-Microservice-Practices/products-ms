FROM node:20-slim

# Reducir vulnerabilidades instalando dependencias necesarias y limpiando
RUN apt-get update && apt-get install -y \
    openssl \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install 
COPY . .

EXPOSE 3001