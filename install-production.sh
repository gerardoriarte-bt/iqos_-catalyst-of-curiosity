#!/bin/bash

# Complete Installation Script for IQOS Catalyst of Curiosity
# Run this script directly on the server: 18.219.75.63

echo "🚀 Installing IQOS Catalyst of Curiosity..."

# Update system
sudo apt update

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y

# Clone the repository
git clone https://github.com/gerardoriarte-bt/iqos_-catalyst-of-curiosity.git
cd iqos_-catalyst-of-curiosity

# Install dependencies
npm install

# Build for production
NODE_ENV=production npm run build

# Create PM2 ecosystem file
cat > ecosystem.config.cjs << 'EOF'
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
EOF

# Start application with PM2
pm2 start ecosystem.config.cjs

# Save PM2 configuration
pm2 save
pm2 startup

# Create Nginx configuration
sudo tee /etc/nginx/sites-available/iqos-catalyst << 'EOF'
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
    
    # Serve static files directly
    location /assets/ {
        root /home/ubuntu/iqos_-catalyst-of-curiosity/dist;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Serve logo directly
    location /IQOS_logo_nbw.png {
        root /home/ubuntu/iqos_-catalyst-of-curiosity/public;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/iqos-catalyst /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and reload Nginx
sudo nginx -t
sudo systemctl reload nginx

# Check application status
echo "📊 Application Status:"
pm2 status

echo "🔍 Testing API:"
curl -s http://localhost:3000/api/health || echo "API not responding"

echo "✅ Installation completed successfully!"
echo "🌐 Application available at: http://18.219.75.63"
echo "📊 Check status with: pm2 status"
echo "📋 View logs with: pm2 logs iqos-catalyst"
