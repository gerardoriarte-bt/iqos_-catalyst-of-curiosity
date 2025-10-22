#!/bin/bash

# Production Deployment Script for IQOS Catalyst of Curiosity
# Server: 18.219.75.63
# Key: iqos.pem

echo "🚀 Starting production deployment..."

# Set production environment
export NODE_ENV=production
export OPENAI_API_KEY="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"

# Build for production
echo "📦 Building for production..."
npm run build

# Create deployment package
echo "📁 Creating deployment package..."
tar -czf iqos-catalyst-production.tar.gz dist/ package.json package-lock.json

# Deploy to server
echo "🌐 Deploying to production server..."
scp -i iqos.pem iqos-catalyst-production.tar.gz ubuntu@18.219.75.63:/home/ubuntu/

# Connect to server and setup
echo "🔧 Setting up on production server..."
ssh -i iqos.pem ubuntu@18.219.75.63 << 'EOF'
    # Extract files
    tar -xzf iqos-catalyst-production.tar.gz
    
    # Install dependencies
    npm install --production
    
    # Install PM2 for process management
    npm install -g pm2
    
    # Create PM2 ecosystem file
    cat > ecosystem.config.js << 'PM2EOF'
module.exports = {
  apps: [{
    name: 'iqos-catalyst',
    script: 'server.js',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      OPENAI_API_KEY: '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'
    }
  }]
};
PM2EOF
    
    # Start application with PM2
    pm2 start ecosystem.config.js
    
    # Save PM2 configuration
    pm2 save
    pm2 startup
    
    # Setup Nginx (if needed)
    sudo apt update
    sudo apt install nginx -y
    
    # Create Nginx configuration
    sudo tee /etc/nginx/sites-available/iqos-catalyst << 'NGINXEOF'
server {
    listen 80;
    server_name 18.219.75.63;
    
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
        root /home/ubuntu/dist;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
NGINXEOF
    
    # Enable site
    sudo ln -sf /etc/nginx/sites-available/iqos-catalyst /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Test and reload Nginx
    sudo nginx -t
    sudo systemctl reload nginx
    
    echo "✅ Deployment completed successfully!"
    echo "🌐 Application available at: http://18.219.75.63"
    echo "📊 Check status with: pm2 status"
EOF

echo "🎉 Production deployment completed!"
echo "🌐 Your application is now live at: http://18.219.75.63"
