# Deployment Guide

This guide explains how to configure the GitHub Actions CI/CD pipeline to deploy the Stamps2 application to your VPS server.

## Overview

The deployment workflow:
1. Triggers on every push to the `main` branch
2. Builds the React application using Vite
3. Deploys the static files to your server via SCP

## Required GitHub Secrets

Configure the following secrets in your GitHub repository:

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** for each secret below

| Secret | Description | Example |
|--------|-------------|---------|
| `SSH_HOST` | Your server's hostname or IP address | `mojserwer.pl` or `192.168.1.100` |
| `SSH_USERNAME` | SSH username for deployment | `deploy`, `www-data`, or your username |
| `SSH_PRIVATE_KEY` | Private SSH key for authentication | Full content of your `id_rsa` file |
| `SSH_PORT` | SSH port (optional, defaults to 22) | `22` |
| `DEPLOY_PATH` | Remote path where files will be deployed | `/var/www/stamps` |

### Adding SSH Private Key

1. Generate an SSH key pair (if you don't have one):
   ```bash
   ssh-keygen -t ed25519 -C "github-actions"
   ```

2. Copy the private key content:
   ```bash
   cat ~/.ssh/id_ed25519
   ```

3. Paste the **entire content** (including `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`) into the `SSH_PRIVATE_KEY` secret.

4. Add the public key to your server's `~/.ssh/authorized_keys` file for the deploy user.

## Server Setup

On your VPS server:

1. **Create deployment directory:**
   ```bash
   sudo mkdir -p /var/www/stamps
   sudo chown deploy:deploy /var/www/stamps
   ```

2. **Configure web server (nginx example):**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/stamps;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

3. **Test SSH connection:**
   ```bash
   ssh -i ~/.ssh/id_ed25519 deploy@your-server.com
   ```

## Workflow File

The workflow is defined in `.github/workflows/deploy.yml`:

```yaml
name: Deploy to VPS
on:
  push:
    branches: [ main ]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build
      - uses: easingthemes/ssh-deploy@v4
```

## Testing the Deployment

1. Commit and push the workflow file:
   ```bash
   git add .github/workflows/deploy.yml
   git commit -m "feat: add CI/CD workflow for VPS deployment"
   git push origin main
   ```

2. Go to the **Actions** tab in your GitHub repository

3. You should see the "Deploy to VPS" workflow running

4. Click on the workflow run to view logs

5. After successful deployment, visit your application URL

## Troubleshooting

### Permission denied (publickey)
- Ensure the public key is added to `~/.ssh/authorized_keys` on the server
- Check that the private key in secrets is complete and correctly formatted

### Connection refused
- Verify the SSH host and port are correct
- Ensure SSH is running on the server: `sudo systemctl status ssh`

### Permission denied (deploy path)
- Ensure the deploy user has write permissions to `DEPLOY_PATH`
- Check ownership: `ls -la /var/www/`

### Build fails
- Check Node.js version compatibility
- Run `npm run build` locally to verify the build works
