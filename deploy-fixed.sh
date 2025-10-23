#!/bin/bash

# Fixed Production Deployment Script for IQOS Catalyst of Curiosity
# Server: 18.219.75.63
# Domain: iqos.buentipo.com
# Key: iqos.pem

echo "🚀 Starting FIXED production deployment to iqos.buentipo.com..."

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

# Create deployment package with ALL necessary files
echo "📁 Creating deployment package..."
tar -czf iqos-catalyst-fixed.tar.gz \
    dist/ \
    package.json \
    package-lock.json \
    server-production.js \
    server.js

# Deploy to server
echo "🌐 Deploying to production server..."
scp -i iqos.pem iqos-catalyst-fixed.tar.gz ubuntu@18.219.75.63:/home/ubuntu/

# Connect to server and setup
echo "🔧 Setting up on production server..."
ssh -i iqos.pem ubuntu@18.219.75.63 << 'EOF'
    echo "🧹 Cleaning up previous deployment..."
    
    # Stop and delete existing PM2 processes
    pm2 stop iqos-catalyst 2>/dev/null || true
    pm2 delete iqos-catalyst 2>/dev/null || true
    
    # Extract files
    tar -xzf iqos-catalyst-fixed.tar.gz
    
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
    
    # Start application with PM2
    pm2 start ecosystem.config.js
    
    # Save PM2 configuration
    pm2 save
    pm2 startup
    
    # Show PM2 status
    echo "📊 PM2 Status:"
    pm2 status
    
    # Test the application
    echo "🔍 Testing application..."
    sleep 5
    curl -f http://localhost:3000/api/health || echo "❌ Health check failed"
    
    echo "✅ Deployment completed successfully!"
    echo "🌐 Application available at:"
    echo "   - HTTP: http://18.219.75.63"
    echo "   - HTTPS: https://iqos.buentipo.com"
    echo "📊 Check status with: pm2 status"
    echo "📝 View logs with: pm2 logs iqos-catalyst"
EOF

echo "🎉 FIXED production deployment completed!"
echo "🌐 Your application is now live at:"
echo "   - HTTP: http://18.219.75.63"
echo "   - HTTPS: https://iqos.buentipo.com"
echo ""
echo "📋 Next steps:"
echo "1. Test the application: curl https://iqos.buentipo.com/api/health"
echo "2. Check PM2 status: ssh -i iqos.pem ubuntu@18.219.75.63 'pm2 status'"
echo "3. View logs: ssh -i iqos.pem ubuntu@18.219.75.63 'pm2 logs iqos-catalyst'"
