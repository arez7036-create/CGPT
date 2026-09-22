import subprocess
import sys

# Try to deploy using SSH with password from command line
password = sys.argv[1] if len(sys.argv) > 1 else "password"

host = "64.176.75.208"
user = "root"
commands = """
cd /root/cgpt
git pull
docker compose pull 2>/dev/null || true
docker compose up -d --force-recreate
docker compose ps
"""

try:
    # Use Windows ssh.exe with password piping
    proc = subprocess.run(
        ["ssh", "-o", "StrictHostKeyChecking=no", "-o", "PreferredAuthentications=password",
         "-o", "BatchMode=no", f"{user}@{host}", commands],
        input=password + "\n",
        capture_output=True,
        text=True,
        timeout=60
    )
    print("STDOUT:", proc.stdout)
    print("STDERR:", proc.stderr)
except Exception as e:
    print(f"Error: {e}")
