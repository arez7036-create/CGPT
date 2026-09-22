import urllib.request, json, time, io

time.sleep(3)

# Check health
resp = urllib.request.urlopen('http://64.176.75.208:4174/health', timeout=10)
print('Health:', resp.read().decode())

# Check if VITE_API_BASE_URL is correctly set in built JS
resp = urllib.request.urlopen('http://64.176.75.208:4173/assets/index-CVamcT2W.js', timeout=10)
js = resp.read().decode()
if '64.176.75.208:4174' in js:
    print('VITE_API_BASE_URL: http://64.176.75.208:4174 (CORRECT)')
elif 'localhost:4174' in js:
    print('VITE_API_BASE_URL: http://localhost:4174 (WRONG - needs .env fix)')
else:
    print('VITE_API_BASE_URL: not found in JS')

# Test streaming API
print()
print('Testing streaming API...')
req = urllib.request.Request(
    'http://64.176.75.208:4174/api/chat/completions',
    data=json.dumps({'provider':'ollama','model':'llama3.2','messages':[{'role':'user','content':'Привет'}],'stream':True}).encode(),
    headers={'Content-Type':'application/json'},
    method='POST'
)
resp = urllib.request.urlopen(req, timeout=30)
for line in io.TextIOWrapper(resp):
    if line.startswith('data:'):
        if '[DONE]' in line:
            print('[DONE]')
            break
        data = json.loads(line[6:].strip())
        if data.get('choices'):
            content = data['choices'][0].get('delta',{}).get('content','')
            if content:
                print(content, end='', flush=True)
print()
print()
print('Streaming test complete!')
