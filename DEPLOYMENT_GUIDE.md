# 🚀 IQOS Catalyst of Curiosity - Production Deployment

## 📋 Deployment Instructions

Since SSH connection is not working, here are alternative methods to deploy:

### Method 1: Direct Server Access
1. **Access your server** (18.219.75.63) through AWS Console or terminal
2. **Download the installation script**:
   ```bash
   wget https://raw.githubusercontent.com/gerardoriarte-bt/iqos_-catalyst-of-curiosity/main/install-production.sh
   chmod +x install-production.sh
   ./install-production.sh
   ```

### Method 2: Manual Installation
1. **Connect to server** and run these commands:
   ```bash
   # Update system
   sudo apt update
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   
   # Install Nginx
   sudo apt install nginx -y
   
   # Clone repository
   git clone https://github.com/gerardoriarte-bt/iqos_-catalyst-of-curiosity.git
   cd iqos_-catalyst-of-curiosity
   
   # Install and build
   npm install
   NODE_ENV=production npm run build
   
   # Start with PM2
   pm2 start server-production.js --name iqos-catalyst
   pm2 save
   pm2 startup
   
   # Configure Nginx (see nginx.conf below)
   sudo systemctl reload nginx
   ```

### Method 3: GitHub Actions (Recommended)
1. **Set up GitHub Actions** for automatic deployment
2. **Configure server secrets** in GitHub repository
3. **Push to main branch** to trigger deployment

## 🔧 Configuration Files

### PM2 Configuration
```javascript
module.exports = {
  apps: [{
    name: 'iqos-catalyst',
    script: 'server-production.js',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      OPENAI_API_KEY: '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'
    }
  }]
};
```

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name 18.219.75.63 _;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    location /assets/ {
        root /home/ubuntu/iqos_-catalyst-of-curiosity/dist;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    location /IQOS_logo_nbw.png {
        root /home/ubuntu/iqos_-catalyst-of-curiosity/public;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## ✅ Features Ready for Production

- ✅ **OpenAI API Integration** - Secure backend proxy
- ✅ **Optimized Build** - 220KB gzipped
- ✅ **Logo Styling** - Turquoise background (#00d1d2)
- ✅ **Responsive Design** - Works on all devices
- ✅ **Error Handling** - Robust error management
- ✅ **Health Checks** - API monitoring endpoint

## 🔍 Verification Commands

```bash
# Check application status
pm2 status

# View logs
pm2 logs iqos-catalyst

# Test API
curl http://18.219.75.63/api/health

# Test application
curl http://18.219.75.63
```

## 🌐 Final URL
Once deployed, your application will be available at:
**http://18.219.75.63**

## 📞 Support
If you encounter any issues, check:
1. PM2 process status: `pm2 status`
2. Nginx configuration: `sudo nginx -t`
3. Application logs: `pm2 logs iqos-catalyst`
4. Server resources: `htop` or `free -h`
