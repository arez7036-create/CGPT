FROM node:20-bookworm

WORKDIR /app

ARG VITE_API_BASE_URL
ARG VITE_BASE_URL
ARG VITE_BACKEND_SERVICE_PROVIDER
ARG VITE_OLLAMA_API_MODEL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_BASE_URL=${VITE_BASE_URL}
ENV VITE_BACKEND_SERVICE_PROVIDER=${VITE_BACKEND_SERVICE_PROVIDER}
ENV VITE_OLLAMA_API_MODEL=${VITE_OLLAMA_API_MODEL}

RUN apt-get update && apt-get install -y \
    build-essential \
    libssl-dev \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .

RUN mkdir -p data/audio data/uploads && npm run build

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}

EXPOSE 4173 4174

CMD npm start