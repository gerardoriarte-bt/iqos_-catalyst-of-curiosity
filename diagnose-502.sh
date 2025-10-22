#!/bin/bash

# Diagnostic Script for 502 Bad Gateway Error
# Run this on the server to identify the issue

echo "🔍 Diagnosing 502 Bad Gateway Error..."

echo "📊 Checking PM2 Status:"
pm2 status

echo ""
echo "📋 Checking PM2 Logs:"
pm2 logs iqos-catalyst --lines 10

echo ""
echo "🔌 Testing Node.js Server Locally:"
curl -s http://localhost:3000/api/health || echo "❌ Node.js server not responding on port 3000"

echo ""
echo "🌐 Testing Nginx Status:"
sudo systemctl status nginx

echo ""
echo "📝 Checking Nginx Configuration:"
sudo nginx -t

echo ""
echo "🔍 Checking Nginx Error Logs:"
sudo tail -n 10 /var/log/nginx/error.log

echo ""
echo "📊 Checking Port Usage:"
sudo netstat -tlnp | grep :3000 || echo "❌ Port 3000 not in use"

echo ""
echo "💾 Checking Disk Space:"
df -h

echo ""
echo "🧠 Checking Memory Usage:"
free -h

echo ""
echo "🔧 Quick Fix Commands:"
echo "1. Restart PM2: pm2 restart iqos-catalyst"
echo "2. Restart Nginx: sudo systemctl restart nginx"
echo "3. Check logs: pm2 logs iqos-catalyst"
echo "4. Test API: curl http://localhost:3000/api/health"
