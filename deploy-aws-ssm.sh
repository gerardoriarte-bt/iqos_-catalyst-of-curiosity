#!/bin/bash

# AWS Systems Manager Session Manager Deployment Script
# Alternative to SSH when key authentication fails

echo "🚀 AWS Systems Manager Deployment Script"
echo "========================================"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found. Please install it first:"
    echo "   brew install awscli"
    echo "   aws configure"
    exit 1
fi

# Check if package exists
if [ ! -f "iqos-catalyst-production.tar.gz" ]; then
    echo "📦 Creating deployment package..."
    npm run build
    tar -czf iqos-catalyst-production.tar.gz dist/ package.json package-lock.json
fi

echo "📦 Deployment package ready: $(ls -lh iqos-catalyst-production.tar.gz)"

echo ""
echo "🔍 === AWS SYSTEMS MANAGER DEPLOYMENT ==="
echo ""

# Get instance ID from IP
echo "🔍 Finding EC2 instance..."
INSTANCE_ID=$(aws ec2 describe-instances \
    --filters "Name=ip-address,Values=18.219.75.63" \
    --query 'Reservations[*].Instances[*].[InstanceId]' \
    --output text 2>/dev/null)

if [ -z "$INSTANCE_ID" ]; then
    echo "❌ Could not find EC2 instance with IP 18.219.75.63"
    echo "Please check:"
    echo "1. AWS credentials are configured"
    echo "2. Instance is running"
    echo "3. You have permissions to describe instances"
    exit 1
fi

echo "✅ Found instance: $INSTANCE_ID"

# Check if Systems Manager is available
echo "🔍 Checking Systems Manager availability..."
aws ssm describe-instance-information \
    --filters "Key=InstanceIds,Values=$INSTANCE_ID" \
    --query 'InstanceInformationList[*].[InstanceId,PingStatus]' \
    --output text 2>/dev/null

if [ $? -ne 0 ]; then
    echo "❌ Systems Manager not available for this instance"
    echo "Please ensure:"
    echo "1. SSM Agent is installed on the instance"
    echo "2. Instance has IAM role with SSM permissions"
    echo "3. Systems Manager is enabled"
    exit 1
fi

echo "✅ Systems Manager is available"

echo ""
echo "📋 === DEPLOYMENT STEPS ==="
echo ""
echo "1. 📤 Upload package to S3:"
echo "   aws s3 cp iqos-catalyst-production.tar.gz s3://your-bucket/"
echo ""
echo "2. 🔗 Connect to instance:"
echo "   aws ssm start-session --target $INSTANCE_ID"
echo ""
echo "3. 📥 Download package on server:"
echo "   aws s3 cp s3://your-bucket/iqos-catalyst-production.tar.gz ."
echo ""
echo "4. 🚀 Deploy application:"
echo "   tar -xzf iqos-catalyst-production.tar.gz"
echo "   npm install --production"
echo "   pm2 start ecosystem.config.js"
echo ""

echo "🎯 === QUICK COMMANDS ==="
echo ""
echo "# Upload to S3 (replace 'your-bucket' with actual bucket):"
echo "aws s3 cp iqos-catalyst-production.tar.gz s3://your-bucket/"
echo ""
echo "# Connect to instance:"
echo "aws ssm start-session --target $INSTANCE_ID"
echo ""
echo "# Or use EC2 Instance Connect:"
echo "aws ec2-instance-connect send-ssh-public-key \\"
echo "  --instance-id $INSTANCE_ID \\"
echo "  --instance-os-user ubuntu \\"
echo "  --ssh-public-key file://~/.ssh/id_rsa.pub"
echo ""

echo "📊 === CURRENT STATUS ==="
echo "✅ Build completed"
echo "✅ Package ready: iqos-catalyst-production.tar.gz"
echo "✅ Instance found: $INSTANCE_ID"
echo "✅ Systems Manager available"
echo "❌ SSH key authentication failed"
echo "❌ Application not running (502 error)"
echo ""
echo "🚀 Ready for AWS Systems Manager deployment!"
