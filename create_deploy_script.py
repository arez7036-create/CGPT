import subprocess
import sys

host = "64.176.75.208"
user = "root"
local_key_pub = "C:\\Users\\aidar\\.ssh\\cgpt_deploy.pub"

# Read public key
with open(local_key_pub, 'r') as f:
    public_key = f.read().strip()

# Use expect-like approach: pipe password to ssh
password = "password"  # We'll try this, but we don't know the actual password

# Actually, let's copy the key using the ssh command with manual input
# Since we can't do this non-interactively without the password,
# let's create a script that the user can run
print("Creating deploy script that user can run...")

# Create a deploy script
deploy_script = """#!/usr/bin/env bash
# Run on the Vultr server as root

cd /root/cgpt
git pull origin main

# Rebuild and restart Docker
docker compose build
docker compose up -d --force-recreate

# Check status
docker compose ps
echo "=== Deploy complete ==="
"""

with open("C:\\PROJECT - CGPT\\cgpt\\deploy_on_server.sh", 'w') as f:
    f.write(deploy_script)
print("Created deploy_on_server.sh")
print("\nUser needs to run this on the server:")
print("1. SSH to server: ssh root@64.176.75.208")
print("2. Run: curl -s https://raw.githubusercontent.com/arez7036-create/CGPT/main/deploy.sh | bash")
print("   OR manually run:")
print("   cd /root/cgpt && git pull && docker compose build && docker compose up -d --force-recreate")
