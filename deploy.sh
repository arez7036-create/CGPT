#!/bin/bash
set -e

echo "=== Deploying CGPT ==="

cd /root/cgpt
git pull

# Create proper .env for production
cat > .env << 'ENDENV'
DATABASE_URL="file:./db/dev.db"
PORT=4174
NODE_ENV=development
VITE_PORT=4173
VITE_BOXED_CHATBUBBLE_MODE_ENABLED=false
CHAT_ARENA_ENABLED=false
VITE_BACKEND_SERVICE_PROVIDER=ollama
VITE_OLLAMA_API_MODEL=llama3.2
VITE_STREAM_ENABLED=true
VITE_REASONING_FORMAT=parsed
VITE_BASE_URL=http://64.176.75.208:4173
VITE_API_BASE_URL=http://64.176.75.208:4174
DEFAULT_SYSTEM_PROMPT="You are CGPT, a helpful AI assistant. You help users with their questions and tasks."
DEFAULT_WELCOME_MESSAGE="Hello! I'm CGPT, your AI assistant. How can I help you today?"
ENDENV

docker compose up -d --build --force-recreate
docker compose ps

echo "=== Deploy complete ==="
echo "Access at: http://64.176.75.208:4173"