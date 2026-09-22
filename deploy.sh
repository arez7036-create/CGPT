#!/bin/bash
set -e

echo "=== CGPT Deployment Script ==="

# Detect server IP address
SERVER_IP=$(hostname -I | awk '{print $1}')
echo "Detected server IP: $SERVER_IP"

# 1. Create .env first (needed by docker compose)
echo "Creating .env file..."
cat > .env << EOF
# Server
PORT=4174
NODE_ENV=production

# CGPT Settings
VITE_BACKEND_SERVICE_PROVIDER=ollama
VITE_OLLAMA_API_MODEL=llama3.2
VITE_API_BASE_URL=http://${SERVER_IP}:4174
VITE_BASE_URL=http://${SERVER_IP}:4173
CONTAINER_NAME=cgpt_chat

# Ollama (Docker internal networking)
OLLAMA_API_URL=http://ollama:11434

# Database
DATABASE_URL="file:./db/dev.db"

# Default Messages
DEFAULT_SYSTEM_PROMPT="You are CGPT, a helpful AI assistant. You help users with their questions and tasks."
DEFAULT_WELCOME_MESSAGE="Hello! I'm CGPT, your AI assistant. How can I help you today?"
EOF

# 2. Start Ollama container
echo "Starting Ollama..."
docker compose up -d ollama

echo "Waiting for Ollama to start..."
sleep 10

# 3. Pull the model
echo "Pulling Llama 3.2 (3B) model..."
docker exec ollama ollama pull llama3.2

# 4. Build and start CGPT
echo "Starting CGPT..."
docker compose up -d --build

echo ""
echo "=== Deployment Complete ==="
echo "Frontend: http://${SERVER_IP}:4173"
echo "Backend:  http://${SERVER_IP}:4174"
echo "Health:   http://${SERVER_IP}:4174/health"
echo ""
echo "Logs:     docker compose logs -f"
