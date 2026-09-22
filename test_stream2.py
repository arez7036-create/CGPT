import http.client
import json
import sys

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
print()

buffer = ""
content = ""
while True:
    line = response.read(1)
    if not line:
        break
    buffer += line.decode('utf-8', errors='replace')
    if buffer.endswith('\n\n'):
        chunk = buffer.strip()
        if chunk.startswith('data:'):
            data_str = chunk[5:].strip()
            try:
                data = json.loads(data_str)
                if data.get('choices'):
                    delta = data['choices'][0].get('delta', {})
                    text_chunk = delta.get('content', '')
                    if text_chunk:
                        content += text_chunk
            except:
                pass
        buffer = ""

sys.stdout.buffer.write(f"Response content: {content}\n".encode('utf-8', errors='replace'))
sys.stdout.buffer.write(f"Total length: {len(content)} chars\n".encode('utf-8', errors='replace'))
conn.close()
print("Streaming test PASSED!")
