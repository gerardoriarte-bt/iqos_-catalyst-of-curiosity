#!/bin/bash

# Production Deployment Script for IQOS Catalyst of Curiosity
# Server: 18.219.75.63
# Domain: iqos.buentipo.com
# Key: iqos.pem

echo "🚀 Starting production deployment to iqos.buentipo.com..."

# Set production environment
export NODE_ENV=production
export OPENAI_API_KEY="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"

# Verify PEM file exists
if [ ! -f "iqos.pem" ]; then
    echo "❌ Error: iqos.pem file not found!"
    echo "Please ensure the PEM file is in the project root directory."
    exit 1
fi

# Set proper permissions for PEM file
chmod 400 iqos.pem

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
    
    # Create environment file
    cat > .env.local << 'ENVEOF'
NODE_ENV=production
PORT=3000
OPENAI_API_KEY=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
ENVEOF
    
    # Install dependencies
    npm install --production
    
    # Install PM2 for process management
    npm install -g pm2
    
    # Create PM2 ecosystem file
    cat > ecosystem.config.js << 'PM2EOF'
module.exports = {
  apps: [{
    name: 'iqos-catalyst',
    script: 'server-production.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      OPENAI_API_KEY: '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'
    }
  }]
};
PM2EOF
    
    # Stop and delete existing PM2 processes
    pm2 stop iqos-catalyst 2>/dev/null || true
    pm2 delete iqos-catalyst 2>/dev/null || true
    
    # Start application with PM2
    pm2 start ecosystem.config.js
    
    # Save PM2 configuration
    pm2 save
    pm2 startup
    
    # Show PM2 status
    pm2 status
    
    # Setup Nginx (if needed)
    sudo apt update
    sudo apt install nginx -y
    
    # Create Nginx configuration for domain
    sudo tee /etc/nginx/sites-available/iqos-catalyst << 'NGINXEOF'
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name iqos.buentipo.com 18.219.75.63;
    return 301 https://$server_name$request_uri;
}

# HTTPS configuration
server {
    listen 443 ssl http2;
    server_name iqos.buentipo.com;
    
    # SSL configuration (will be updated with Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/iqos.buentipo.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/iqos.buentipo.com/privkey.pem;
    
    # SSL security settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Main application
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
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
    
    # Serve static files directly with caching
    location /assets/ {
        root /home/ubuntu/dist;
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
    }
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}

# Fallback for IP access (HTTP only)
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
    
    # Install Certbot for SSL certificates
    sudo apt install certbot python3-certbot-nginx -y
    
    # Setup SSL certificate (this will prompt for email)
    echo "🔒 Setting up SSL certificate..."
    echo "You will need to run this command manually after deployment:"
    echo "sudo certbot --nginx -d iqos.buentipo.com"
    
    echo "✅ Deployment completed successfully!"
    echo "🌐 Application available at:"
    echo "   - HTTP: http://18.219.75.63"
    echo "   - HTTPS: https://iqos.buentipo.com (after SSL setup)"
    echo "📊 Check status with: pm2 status"
    echo "🔒 Setup SSL with: sudo certbot --nginx -d iqos.buentipo.com"
EOF

echo "🎉 Production deployment completed!"
echo "🌐 Your application is now live at:"
echo "   - HTTP: http://18.219.75.63"
echo "   - HTTPS: https://iqos.buentipo.com (after SSL setup)"
echo ""
echo "📋 Next steps:"
echo "1. Connect to your server: ssh -i iqos.pem ubuntu@18.219.75.63"
echo "2. Setup SSL certificate: sudo certbot --nginx -d iqos.buentipo.com"
echo "3. Check application status: pm2 status"
echo "4. View logs: pm2 logs iqos-catalyst"
