#!/bin/bash
# Deploy CGPT with latest fixes

set -e

echo "=== Creating .env file ==="
cat > /root/cgpt/.env << 'ENDENV'
DATABASE_URL="file:./db/dev.db"
PORT=4174
NODE_ENV=production
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
OPENAI_API_KEY=
GROQ_API_KEY=
CLAUDE_API_KEY=
GOOGLE_API_KEY=
OPENROUTER_API_KEY=
FLOWISE_API_KEY=
CONTAINER_NAME=cgpt_chat
OLLAMA_API_URL=http://ollama:11434
ENDENV

echo "=== Pulling latest code ==="
cd /root/cgpt
git pull

echo "=== Building Docker image ==="
docker compose build

echo "=== Restarting containers ==="
docker compose up -d --force-recreate

echo "=== Container status ==="
docker compose ps

echo "=== Checking logs ==="
sleep 5
docker compose logs --tail=30 cgpt_chat

echo "=== Deploy complete ==="
