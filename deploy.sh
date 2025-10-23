#!/bin/bash

# Simple Deployment Script for EC2 T3 Micro
# Optimized for minimal resource usage

set -e

echo "🚀 Deploying IQOS Catalyst to EC2..."

# Check if required files exist
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found!"
    exit 1
fi

if [ ! -f "server-production.js" ]; then
    echo "❌ server-production.js not found!"
    exit 1
fi

# Build the application
echo "📦 Building application..."
npm run build

# Install production dependencies only
echo "📥 Installing production dependencies..."
npm install --production --no-optional

# Create logs directory
mkdir -p logs

# Create environment file if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local not found. Please create it with your OpenAI API key."
    echo "Example:"
    echo "OPENAI_API_KEY=your_api_key_here"
    echo "NODE_ENV=production"
    echo "PORT=3000"
    exit 1
fi

# Install PM2 if not installed
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    npm install -g pm2
fi

# Stop existing processes
echo "🛑 Stopping existing processes..."
pm2 stop iqos-catalyst 2>/dev/null || true
pm2 delete iqos-catalyst 2>/dev/null || true

# Start the application
echo "🚀 Starting application with PM2..."
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup
pm2 startup

echo "✅ Deployment completed!"
echo "📊 Application status:"
pm2 status

echo ""
echo "🔍 Useful commands:"
echo "  pm2 status          - Check application status"
echo "  pm2 logs iqos-catalyst - View application logs"
echo "  pm2 restart iqos-catalyst - Restart application"
echo "  pm2 stop iqos-catalyst - Stop application"
