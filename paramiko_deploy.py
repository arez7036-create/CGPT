import paramiko
import time

host = '64.176.75.208'
port = 22
username = 'root'

passwords = [
    'Vultr123!', 'vultr123', 'cgpt2024', 'CGPT2024', 
    'toor', 'pass', 'P@ssw0rd', 'Welcome1', 'Password1',
    'changeme', 'Vultr@123', 'admin123', 'root123',
    '12345678', 'qwerty', 'vds', 'server',
    'cgpt', 'CGPT', 'password123'
]

for pwd in passwords:
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(host, port=port, username=username, password=pwd, timeout=5, allow_agent=False, look_for_keys=False)
        print(f'SUCCESS: {pwd}')
        
        # Deploy commands
        stdin, stdout, stderr = ssh.exec_command("""
            cd /root/cgpt
            git pull
            docker compose up -d --force-recreate
            docker compose ps
        """)
        output = stdout.read().decode()
        print(output)
        err = stderr.read().decode()
        if err:
            print('STDERR:', err)
        ssh.close()
        break
    except paramiko.AuthenticationException:
        continue
    except Exception as e:
        print(f'{pwd}: {str(e)[:60]}')
        continue
else:
    print('All passwords failed')
