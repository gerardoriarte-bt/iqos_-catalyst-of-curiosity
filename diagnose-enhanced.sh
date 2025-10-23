#!/bin/bash

# Enhanced Diagnostic Script for IQOS Catalyst
# Works without SSH access

echo "🔍 Enhanced Diagnostic Script for IQOS Catalyst"
echo "=============================================="

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
echo "🔧 === IDENTIFIED ISSUES ==="
echo "1. ❌ Wrong server file: PM2 was using 'server.js' instead of 'server-production.js'"
echo "2. ❌ Port conflict: server.js uses port 3001, server-production.js uses port 3000"
echo "3. ❌ Missing environment file: .env.local not created"
echo "4. ❌ PM2 configuration: Wrong script path and exec mode"
echo ""
echo "✅ === FIXES APPLIED ==="
echo "1. ✅ Updated PM2 to use 'server-production.js'"
echo "2. ✅ Fixed port configuration (3000)"
echo "3. ✅ Added environment file creation"
echo "4. ✅ Changed exec mode from 'cluster' to 'fork'"
echo "5. ✅ Added PM2 cleanup before restart"
echo ""
echo "🚀 === SOLUTION ==="
echo "Run the fixed deployment script:"
echo "./deploy-fixed.sh"
echo ""
echo "This will:"
echo "1. Stop and delete existing PM2 processes"
echo "2. Deploy with correct server file"
echo "3. Create proper environment configuration"
echo "4. Start PM2 with correct settings"
echo "5. Test the application"
echo ""
echo "🎯 === EXPECTED RESULT ==="
echo "After running deploy-fixed.sh:"
echo "✅ https://iqos.buentipo.com should work"
echo "✅ API endpoints should respond"
echo "✅ PM2 should show stable status (no crashes)"
echo ""
echo "📋 === VERIFICATION COMMANDS ==="
echo "After deployment, test with:"
echo "curl https://iqos.buentipo.com/api/health"
echo "curl https://iqos.buentipo.com"
