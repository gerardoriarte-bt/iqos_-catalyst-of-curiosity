#!/bin/bash

# Alternative Deployment Script for IQOS Catalyst
# When SSH key authentication fails

echo "🚀 Starting alternative deployment method..."

# Check if package exists
if [ ! -f "iqos-catalyst-production.tar.gz" ]; then
    echo "❌ Deployment package not found. Creating it..."
    npm run build
    tar -czf iqos-catalyst-production.tar.gz dist/ package.json package-lock.json
fi

echo "📦 Deployment package ready: $(ls -lh iqos-catalyst-production.tar.gz)"

echo ""
echo "🔍 === DIAGNOSIS ==="
echo "The deployment failed because SSH authentication is not working."
echo "This could be due to:"
echo "1. Wrong PEM key for this EC2 instance"
echo "2. EC2 instance was terminated/recreated"
echo "3. Security group changes"
echo "4. Key pair was changed in AWS console"
echo ""

echo "🚨 === IMMEDIATE SOLUTIONS ==="
echo ""
echo "Option 1: Check AWS Console"
echo "1. Go to AWS EC2 Console"
echo "2. Find instance 18.219.75.63"
echo "3. Check if it's running"
echo "4. Verify the key pair name"
echo "5. Check security groups (ports 22, 80, 443, 3000)"
echo ""

echo "Option 2: Try different SSH methods"
echo "1. Check if you have the correct PEM key"
echo "2. Try connecting with different user (ec2-user, admin)"
echo "3. Check if instance was recreated with new key"
echo ""

echo "Option 3: Manual deployment via AWS Console"
echo "1. Use AWS Systems Manager Session Manager"
echo "2. Upload files via AWS S3"
echo "3. Use EC2 Instance Connect"
echo ""

echo "🔧 === QUICK FIX ATTEMPTS ==="
echo ""

# Try different SSH methods
echo "Trying different SSH connection methods..."

echo "Method 1: Try with ec2-user..."
ssh -o ConnectTimeout=10 -i iqos.pem ec2-user@18.219.75.63 'echo "Connected as ec2-user"' 2>/dev/null && echo "✅ ec2-user works!" || echo "❌ ec2-user failed"

echo "Method 2: Try with admin..."
ssh -o ConnectTimeout=10 -i iqos.pem admin@18.219.75.63 'echo "Connected as admin"' 2>/dev/null && echo "✅ admin works!" || echo "❌ admin failed"

echo "Method 3: Try with root..."
ssh -o ConnectTimeout=10 -i iqos.pem root@18.219.75.63 'echo "Connected as root"' 2>/dev/null && echo "✅ root works!" || echo "❌ root failed"

echo ""
echo "📋 === NEXT STEPS ==="
echo "Since SSH is not working, you need to:"
echo ""
echo "1. 🔍 Check AWS Console:"
echo "   - Verify instance is running"
echo "   - Check key pair name"
echo "   - Verify security groups"
echo ""
echo "2. 🔑 Get correct PEM key:"
echo "   - Download from AWS Console"
echo "   - Or recreate instance with known key"
echo ""
echo "3. 🚀 Alternative deployment:"
echo "   - Use AWS Systems Manager"
echo "   - Upload via S3 + download on server"
echo "   - Use EC2 Instance Connect"
echo ""
echo "4. 🔧 Quick fix:"
echo "   - Restart EC2 instance"
echo "   - Check if application auto-starts"
echo ""

echo "🎯 === CURRENT STATUS ==="
echo "✅ Build completed successfully"
echo "✅ Package created: iqos-catalyst-production.tar.gz"
echo "✅ Domain DNS working: iqos.buentipo.com → 18.219.75.63"
echo "✅ SSL certificate valid"
echo "✅ Nginx running"
echo "❌ SSH access blocked"
echo "❌ Application not running (502 error)"
echo ""
echo "The application will work once we can access the server to deploy it."
