#!/bin/bash

# Alternative Diagnostic Script for IQOS Catalyst
# When SSH access is not available

echo "🔍 Running alternative diagnostics..."

echo "📊 === CONNECTIVITY TESTS ==="

# Test basic connectivity
echo "🌐 Testing basic connectivity..."
ping -c 2 18.219.75.63

echo ""
echo "🔌 Testing port connectivity..."
nc -zv 18.219.75.63 80
nc -zv 18.219.75.63 443
nc -zv 18.219.75.63 3000

echo ""
echo "🌐 Testing HTTP responses..."

# Test HTTP
echo "📡 HTTP Test:"
curl -I http://18.219.75.63 --connect-timeout 10

echo ""
echo "📡 HTTPS Test:"
curl -I https://iqos.buentipo.com --connect-timeout 10

echo ""
echo "📡 API Health Test:"
curl -v http://18.219.75.63/api/health --connect-timeout 10

echo ""
echo "📡 Domain API Test:"
curl -v https://iqos.buentipo.com/api/health --connect-timeout 10

echo ""
echo "🔍 === PROBLEM ANALYSIS ==="
echo "❌ Error 502 Bad Gateway indicates:"
echo "   - Nginx is running and receiving requests"
echo "   - Nginx cannot connect to the backend application"
echo "   - The Node.js application is likely not running"
echo ""
echo "🔧 === POSSIBLE SOLUTIONS ==="
echo "1. The application (PM2) is not running"
echo "2. The application is not listening on port 3000"
echo "3. There's a firewall blocking port 3000"
echo "4. The application crashed and needs to be restarted"
echo ""
echo "📋 === NEXT STEPS ==="
echo "Since SSH access is not working, you need to:"
echo "1. Check AWS EC2 console for server status"
echo "2. Verify the PEM key is correct for this instance"
echo "3. Check if the instance was restarted and lost the application"
echo "4. Consider redeploying the application"
echo ""
echo "🚀 === QUICK FIX OPTIONS ==="
echo "Option 1: Redeploy the application"
echo "   ./deploy-production.sh"
echo ""
echo "Option 2: Check AWS console and restart instance if needed"
echo ""
echo "Option 3: Verify PEM key is correct for this EC2 instance"
