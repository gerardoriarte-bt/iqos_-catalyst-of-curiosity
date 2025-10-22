#!/bin/bash

# SSL Configuration Script for iqos.buentipo.com
# Run this AFTER the main installation script

echo "🔒 Setting up SSL certificate for iqos.buentipo.com..."

# Install Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d iqos.buentipo.com -d www.iqos.buentipo.com --non-interactive --agree-tos --email admin@buentipo.com

# Test SSL configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Set up automatic renewal
sudo crontab -l 2>/dev/null | { cat; echo "0 12 * * * /usr/bin/certbot renew --quiet"; } | sudo crontab -

echo "✅ SSL certificate installed successfully!"
echo "🔒 Your site is now available at: https://iqos.buentipo.com"
echo "🔄 SSL certificate will auto-renew"
