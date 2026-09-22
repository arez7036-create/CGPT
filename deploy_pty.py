import subprocess
import sys
import os
import pty

host = "64.176.75.208"
user = "root"
password = sys.argv[1] if len(sys.argv) > 1 else None

commands = """cd /root/cgpt && git pull && docker compose up -d --force-recreate && docker compose ps && echo "DEPLOY DONE"
"""

# Method 1: Try using pexpect-like behavior with subprocess
import subprocess

# Create the SSH command
ssh_cmd = [
    "ssh", "-o", "StrictHostKeyChecking=no", 
    "-o", "PreferredAuthentications=password",
    "-o", "BatchMode=no",
    f"{user}@{host}",
    commands
]

# Use a pty for interactive password entry
try:
    master, slave = pty.openpty()
    proc = subprocess.Popen(
        ssh_cmd,
        stdin=slave,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True
    )
    os.close(slave)
    
    if password:
        proc.stdin.write(password + "\n")
        proc.stdin.flush()
    
    # Read output
    output = ""
    while True:
        try:
            char = proc.stdout.read(1)
            if not char:
                break
            output += char
            sys.stdout.write(char)
            sys.stdout.flush()
        except:
            break
    
    result = proc.wait(timeout=120)
    print(f"\nExit code: {result}")
except Exception as e:
    print(f"Error: {e}")
    # Fallback: try with subprocess and stdin pipe
    try:
        proc = subprocess.run(
            ssh_cmd,
            input=password + "\n" if password else "",
            capture_output=True,
            text=True,
            timeout=120
        )
        print("STDOUT:", proc.stdout)
        print("STDERR:", proc.stderr)
    except Exception as e2:
        print(f"Fallback error: {e2}")
