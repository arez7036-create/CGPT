#!/bin/bash
set -e

echo "=== CGPT Deployment Script ==="

# 1. Install Docker if not present
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    apt-get update
    apt-get install -y ca-certificates curl gnupg lsb-release
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] \
      https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
      | tee /etc/apt/sources.list.d/docker.list > /dev/null
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
fi

# 2. Start CGPT services
echo "Starting Ollama (model download will take a few minutes)..."
docker compose up -d ollama

echo "Waiting for Ollama to start..."
sleep 10

# 3. Pull the model
echo "Pulling Llama 3.2 (3B) model..."
docker exec ollama ollama pull llama3.2

# 4. Create .env
echo "Creating .env file..."
cat > .env << 'EOF'
# Server
PORT=4174
NODE_ENV=production

# CGPT Settings
VITE_BACKEND_SERVICE_PROVIDER=ollama
VITE_OLLAMA_API_MODEL=llama3.2
VITE_API_BASE_URL=http://localhost:4174
VITE_BASE_URL=http://localhost:4173

# Ollama (Docker internal networking)
OLLAMA_API_URL=http://ollama:11434

# Database
DATABASE_URL="file:./db/dev.db"

# Default Messages
DEFAULT_SYSTEM_PROMPT="You are CGPT, a helpful AI assistant. You help users with their questions and tasks."
DEFAULT_WELCOME_MESSAGE="Hello! I'm CGPT, your AI assistant. How can I help you today?"
EOF

# 5. Start CGPT
echo "Starting CGPT..."
docker compose up -d

echo ""
echo "=== Deployment Complete ==="
echo "Frontend: http://localhost:4173"
echo "Backend:  http://localhost:4174"
echo "Health:    http://localhost:4174/health"
echo ""
echo "Logs:      docker compose logs -f"
