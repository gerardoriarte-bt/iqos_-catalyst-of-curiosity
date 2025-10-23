#!/bin/bash

# Deployment Diagnostic Script for IQOS Catalyst of Curiosity
# Server: 18.219.75.63
# Domain: iqos.buentipo.com

echo "🔍 Running deployment diagnostics..."

# Verify PEM file exists
if [ ! -f "iqos.pem" ]; then
    echo "❌ Error: iqos.pem file not found!"
    echo "Please ensure the PEM file is in the project root directory."
    exit 1
fi

# Set proper permissions for PEM file
chmod 400 iqos.pem

echo "🌐 Connecting to server for diagnostics..."
ssh -i iqos.pem ubuntu@18.219.75.63 << 'EOF'
    echo "📊 === DEPLOYMENT STATUS ==="
    
    # Check PM2 status
    echo "🔧 PM2 Application Status:"
    pm2 status
    
    echo ""
    echo "📝 PM2 Logs (last 20 lines):"
    pm2 logs iqos-catalyst --lines 20
    
    echo ""
    echo "🌐 Nginx Status:"
    sudo systemctl status nginx --no-pager -l
    
    echo ""
    echo "🔒 SSL Certificate Status:"
    if command -v certbot &> /dev/null; then
        sudo certbot certificates
    else
        echo "Certbot not installed"
    fi
    
    echo ""
    echo "📁 Application Files:"
    ls -la /home/ubuntu/
    ls -la /home/ubuntu/dist/
    
    echo ""
    echo "🌐 Port Status:"
    sudo netstat -tlnp | grep :80
    sudo netstat -tlnp | grep :443
    sudo netstat -tlnp | grep :3000
    
    echo ""
    echo "🔍 Nginx Configuration Test:"
    sudo nginx -t
    
    echo ""
    echo "📊 System Resources:"
    df -h
    free -h
    uptime
EOF

echo ""
echo "🌐 Testing external connectivity..."
echo "Testing HTTP access to IP:"
curl -I http://18.219.75.63 --connect-timeout 10 || echo "❌ HTTP access failed"

echo ""
echo "Testing domain access:"
curl -I http://iqos.buentipo.com --connect-timeout 10 || echo "❌ Domain HTTP access failed"

echo ""
echo "Testing HTTPS access:"
curl -I https://iqos.buentipo.com --connect-timeout 10 || echo "❌ HTTPS access failed (SSL may not be configured yet)"

echo ""
echo "🎯 Diagnostic completed!"
echo "📋 If you see any issues:"
echo "1. Check PM2 logs: ssh -i iqos.pem ubuntu@18.219.75.63 'pm2 logs iqos-catalyst'"
echo "2. Restart application: ssh -i iqos.pem ubuntu@18.219.75.63 'pm2 restart iqos-catalyst'"
echo "3. Setup SSL: ./setup-ssl.sh"
