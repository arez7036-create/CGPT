#!/bin/bash
# Test with the exact structure the client sends
JSON='{"messages":[{"role":"system","content":"You are CGPT"},{"role":"user","content":"hello"}],"model":"llama3.2","temperature":0.7,"stream":true,"provider":"ollama"}'
echo "Sending: $JSON"
curl -v -X POST http://localhost:4174/api/chat/completions \
  -H 'Content-Type: application/json' \
  -d "$JSON" 2>&1
