# 🚀 IQOS Catalyst of Curiosity

> AI-powered marketing idea generator for the IQOS brand

## 🌟 Overview

IQOS Catalyst of Curiosity is an innovative web application that generates creative marketing ideas using AI. Built with React, Express, and OpenAI's GPT-4, it helps marketers create compelling campaigns that embody the "Forever Curious" brand strategy.

## ✨ Features

- **AI-Powered Idea Generation**: Generate 5 unique marketing concepts using GPT-4
- **Visual Prompt Creation**: Automatically create detailed prompts for image generation
- **Brand-Aligned Strategy**: Built around IQOS's "Forever Curious" brand philosophy
- **Responsive Design**: Modern, minimalist UI with Material Design principles
- **Real-time Generation**: Fast, interactive idea generation experience

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Backend**: Express.js, Node.js
- **AI**: OpenAI GPT-4, DALL-E 3
- **Styling**: CSS3, Material Design principles
- **Deployment**: AWS EC2, Nginx, PM2

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm 8+
- OpenAI API key

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/iqos-catalyst-of-curiosity.git
cd iqos-catalyst-of-curiosity

# Install dependencies
npm install

# Create environment file
echo "OPENAI_API_KEY=your_openai_api_key_here" > .env.local

# Start development server
npm run dev:full
```

### Environment Variables

Create a `.env.local` file with:

```env
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=development
```

## 📦 Production Deployment

### Build for Production

```bash
npm run build
npm start
```

### EC2 Deployment

1. **Launch EC2 T3 Micro instance**
2. **Install Node.js 18+**
3. **Clone repository**
4. **Install dependencies**: `npm install --production`
5. **Set environment variables**
6. **Start with PM2**: `pm2 start ecosystem.config.js`

### PM2 Configuration

```javascript
module.exports = {
  apps: [{
    name: 'iqos-catalyst',
    script: 'server-production.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      OPENAI_API_KEY: 'your_api_key'
    }
  }]
};
```

## 🏗️ Project Structure

```
iqos-catalyst-of-curiosity/
├── components/          # React components
│   ├── BriefForm.tsx    # Main form component
│   ├── IdeaCard.tsx     # Idea display component
│   └── ...
├── services/            # API services
│   ├── apiService.ts    # OpenAI integration
│   └── ...
├── server.js            # Development server
├── server-production.js  # Production server
├── App.tsx              # Main React app
└── package.json         # Dependencies
```

## 🎯 Brand Strategy

The application is built around IQOS's core brand strategy:

- **"Forever Curious = The pleasure of uncertainty"**
- **Target Audience**: Experience Explorers (LANU-29)
- **Brand Theme**: "What if...?" moments
- **Tone**: Sensual, electric, restless

## 🔧 API Endpoints

- `POST /api/generate-ideas` - Generate marketing ideas
- `POST /api/generate-image` - Generate visual prompts
- `GET /api/health` - Health check

## 📊 Performance

- **Bundle Size**: ~220KB (gzipped: ~68KB)
- **Build Time**: <1 second
- **Memory Usage**: ~18MB (EC2 T3 Micro)
- **Response Time**: <3 seconds for idea generation

## 🚨 Requirements

### Minimum System Requirements

- **CPU**: 1 vCPU (EC2 T3 Micro)
- **RAM**: 1GB
- **Storage**: 8GB SSD
- **Network**: 1 Gbps

### Recommended for Production

- **CPU**: 2 vCPU
- **RAM**: 2GB
- **Storage**: 20GB SSD
- **Network**: 1 Gbps

## 🔒 Security

- Environment variables for API keys
- CORS configuration
- Input validation
- Error handling
- No sensitive data in client code

## 📈 Monitoring

- PM2 process management
- Health check endpoint
- Error logging
- Performance metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
- Create an issue on GitHub
- Check the documentation
- Review the troubleshooting guide

---

**Built with ❤️ for the IQOS brand**