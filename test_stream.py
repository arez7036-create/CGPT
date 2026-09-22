import http.client
import json

conn = http.client.HTTPConnection("64.176.75.208", 4174, timeout=60)

body = json.dumps({
    'provider': 'ollama',
    'model': 'llama3.2',
    'messages': [{'role': 'user', 'content': 'Привет'}],
    'stream': True
})

headers = {'Content-Type': 'application/json'}

conn.request("POST", "/api/chat/completions", body, headers)
response = conn.getresponse()

print(f"Status: {response.status}")
print(f"Content-Type: {response.getheader('Content-Type')}")

buffer = ""
while True:
    line = response.read(1)
    if not line:
        break
    buffer += line.decode('utf-8', errors='replace')
    if buffer.endswith('\n\n'):
        print(buffer.strip()[:200])
        buffer = ""

conn.close()
print("\nStreaming test complete!")
