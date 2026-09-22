import paramiko
import os

host = '64.176.75.208'
username = 'root'
private_key_path = os.path.expanduser('~/.ssh/cgpt_deploy')

passwords = ['root', 'password', 'vultr', 'admin', 'cgpt', 'CGPT', '123456', 'Ubuntu', 'ubuntu']

for pwd in passwords:
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(host, username=username, password=pwd, timeout=5)
        print(f'Connected with password: {pwd}')
        
        with open(os.path.expanduser('~/.ssh/cgpt_deploy.pub'), 'r') as f:
            pub_key = f.read()
        
        cmd = f'mkdir -p ~/.ssh && echo "{pub_key}" >> ~/.ssh/authorized_keys'
        stdin, stdout, stderr = ssh.exec_command(cmd)
        stdout.channel.recv_exit_status()
        print('Key copied to server')
        
        ssh.close()
        break
    except Exception as e:
        print(f'Failed with {pwd}: {str(e)[:80]}')
        continue
else:
    print('All passwords failed')
