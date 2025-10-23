#!/bin/bash

# SSL Setup Script for IQOS Catalyst of Curiosity
# Domain: iqos.buentipo.com
# Server: 18.219.75.63

echo "🔒 Setting up SSL certificate for iqos.buentipo.com..."

# Verify PEM file exists
if [ ! -f "iqos.pem" ]; then
    echo "❌ Error: iqos.pem file not found!"
    echo "Please ensure the PEM file is in the project root directory."
    exit 1
fi

# Set proper permissions for PEM file
chmod 400 iqos.pem

# Connect to server and setup SSL
echo "🌐 Connecting to server to setup SSL..."
ssh -i iqos.pem ubuntu@18.219.75.63 << 'EOF'
    echo "🔒 Setting up SSL certificate with Let's Encrypt..."
    
    # Check if certbot is installed
    if ! command -v certbot &> /dev/null; then
        echo "Installing Certbot..."
        sudo apt update
        sudo apt install certbot python3-certbot-nginx -y
    fi
    
    # Setup SSL certificate
    echo "Setting up SSL certificate for iqos.buentipo.com..."
    echo "This will prompt for an email address for Let's Encrypt notifications."
    
    # Run certbot with nginx plugin
    sudo certbot --nginx -d iqos.buentipo.com --non-interactive --agree-tos --email admin@buentipo.com
    
    # Test the certificate renewal
    sudo certbot renew --dry-run
    
    # Reload nginx to apply SSL configuration
    sudo systemctl reload nginx
    
    echo "✅ SSL certificate setup completed!"
    echo "🌐 Your application is now available at: https://iqos.buentipo.com"
    echo "🔒 SSL certificate will auto-renew every 90 days"
    
    # Show certificate info
    echo "📋 Certificate information:"
    sudo certbot certificates
EOF

echo "🎉 SSL setup completed!"
echo "🌐 Your application is now secure at: https://iqos.buentipo.com"
echo ""
echo "📋 Verification steps:"
echo "1. Visit https://iqos.buentipo.com"
echo "2. Check SSL certificate in browser"
echo "3. Test all application functionality"
echo "4. Monitor logs: ssh -i iqos.pem ubuntu@18.219.75.63 'pm2 logs iqos-catalyst'"