import urllib.request, re

resp = urllib.request.urlopen('http://64.176.75.208:4173/', timeout=10)
html = resp.read().decode()
scripts = re.findall(r'src="([^"]+\.js)"', html)
print('Script files:', scripts)
for s in scripts:
    js = urllib.request.urlopen('http://64.176.75.208:4173/' + s, timeout=10).read().decode()
    if '4174' in js:
        lines = js.split('\n')
        for i, line in enumerate(lines):
            if '4174' in line or 'localhost' in line or '64.176' in line:
                print(f'Found in {s}:{lines.index(line)}: {line[:300]}')
        break
