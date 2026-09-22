import paramiko
import os

host = "64.176.75.208"
username = "root"
private_key_path = os.path.expanduser("~/.ssh/cgpt_deploy")

# Try key-based auth first
try:
    key = paramiko.Ed25519Key.from_private_key_file(private_key_path)
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(host, username=username, pkey=key, timeout=10)
    print("Connected via SSH key")
    
    # Run deploy commands
    deploy_cmds = """cd /root/cgpt
    git pull
    docker compose build
    docker compose up -d --force-recreate
    docker compose ps
    """
    stdin, stdout, stderr = ssh.exec_command(deploy_cmds)
    print(stdout.read().decode())
    print("Error:", stderr.read().decode())
    ssh.close()
except Exception as e:
    print(f"SSH key auth failed: {e}")
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(host, username=username, password="root", timeout=10)
        print("Connected via password")
    except Exception as e2:
        print(f"Password auth also failed: {e2}")
