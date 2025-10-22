#!/bin/bash

# Complete Fix Script for 502 Bad Gateway - Run this directly on the server
# Copy and paste this entire script into your server terminal

echo "🔧 Fixing 502 Bad Gateway Error..."

# Stop all PM2 processes
echo "🛑 Stopping PM2 processes..."
pm2 stop all 2>/dev/null || true
pm2 delete all 2>/dev/null || true

# Navigate to project directory
cd /home/ubuntu/iqos_-catalyst-of-curiosity 2>/dev/null || {
    echo "📁 Project directory not found. Creating it..."
    mkdir -p /home/ubuntu/iqos_-catalyst-of-curiosity
    cd /home/ubuntu/iqos_-catalyst-of-curiosity
    
    # Clone the repository
    git clone https://github.com/gerardoriarte-bt/iqos_-catalyst-of-curiosity.git .
}

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build for production
echo "🏗️ Building for production..."
NODE_ENV=production npm run build

# Create server-production.js if it doesn't exist
if [ ! -f "server-production.js" ]; then
    echo "📝 Creating server-production.js..."
    cat > server-production.js << 'EOF'
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Knowledge base
const KNOWLEDGE_BASE = `
  **Brand Strategy: "Forever Curious = The pleasure of uncertainty."**
  - Core principle: IQOS owns the questions, not the answers.
  - Narrative Structure: Open-ended (Setup -> Tension -> ???), creating a built-in cliffhanger.
  - Brand Theme: "What if...?" - moments of unpredictable outcomes.
  - Tone: Sensual, electric, restless, about anticipation and discovery.

  **Target Audience: "Experience Explorers" (LANU-29)**
  - Characteristics: Fluid with choices, switch-ready mindset, value style, design, portability, and subtlety. They see nicotine as a lifestyle enhancement, not an addiction.
  - Core Desires: They seek to match their rhythm, stay stylish, be bold, and be constantly surprised.
  - Core Conflicts: They are navigating the tension between resisting conformity and embracing uncertainty. IQOS should empower them to forge their own path.
  - Cultural Nuance: Curiosity is experienced differently across cultures. Ideas must be tailored to be relevant and aspirational within the specified cultural context.

  **Curiosity Taxonomy:**
  - Cognitive: Information Gap (what's missing?), Mental Challenge (solving puzzles).
  - Emotional: FOMO (fear of missing out), Mystery (suspense).
  - Motivational: Perceptual Curiosity (exploring new sensations), Reward System (the joy of discovery).
  - Cultural: Shared Symbols (decoding cultural codes), Imitation (joining in).

  **Guardrails:** Avoid crime, politics, health claims, and controversial topics.
`;

const getPrompt = (brief) => `
  You are the "Catalyst of Curiosity," an energetic, provocative, and adventurous AI Assistant for the IQOS brand.
  Your mission is to generate marketing concepts for the "Experience Explorers" (LANU-29) audience.
  You must operate based on the following knowledge base:
  ${KNOWLEDGE_BASE}

  **Task:**
  Generate 5 distinct, highly detailed, and creative marketing ideas.
  The ideas must be a combination of the user's provided brief and should be culturally relevant for the specified country.
  If 'Global' is selected, the idea should have broad, universal appeal.
  Each idea should ideally represent a different execution format (e.g., Digital, Offline/Retail, BTL, Experiential Event).
  Crucially, create a 'visualPrompt' field for each idea containing a detailed, artistic prompt for an image generation model. This prompt should describe a scene that captures the idea's essence, adhering to the IQOS aesthetic: clean, modern, sophisticated, sensual, and electric, with strategic use of turquoise and black.

  **User Brief:**
  - **Primary Takeaway to Embody:** ${brief.primaryTakeaway}
  - **Curiosity Trigger to Use:** ${brief.curiosityTrigger}
  - **Target Country:** ${brief.country}

  You MUST respond with only a JSON object that validates against the provided schema. Do not include markdown formatting or any text outside the JSON object.

  **JSON Schema:**
  {
    "ideas": [
      {
        "ideaTitle": "A provocative and captivating title, often framed as a 'What if...?' question.",
        "conceptDescription": "A detailed, immersive description of the concept (3-4 sentences).",
        "executionFormat": "Clearly label the format (e.g., Digital/Social Media, Offline/Retail, BTL, Experiential Event).",
        "keyStrategicDrivers": {
          "curiosityTrigger": "Explain how the idea employs the selected Curiosity Trigger.",
          "brandTrait": "Detail how the idea manifests the chosen Primary Takeaway."
        },
        "experienceExplorersResonance": {
          "appeal": "Explain how this idea specifically appeals to the Experience Explorers (LANU-29), referencing their values like style, non-conformity, or the thrill of discovery.",
          "dimensions": "Briefly mention the Cognitive, Emotional, Motivational, and Cultural dimensions it activates."
        },
        "whatIf": "Frame the open-ended question or the unresolved tension the idea creates, embodying the core 'pleasure of uncertainty' strategy.",
        "visualPrompt": "A detailed, artistic prompt for an image generation model, capturing the idea's essence with an IQOS aesthetic."
      }
    ]
  }
`;

// Generate marketing ideas endpoint
app.post('/api/generate-ideas', async (req, res) => {
  try {
    const { brief } = req.body;
    
    if (!brief) {
      return res.status(400).json({ error: 'Brief is required' });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: getPrompt(brief)
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
      max_tokens: 4000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response content received from OpenAI.");
    }

    const jsonResponse = JSON.parse(content);
    res.json({ ideas: jsonResponse.ideas || [] });

  } catch (error) {
    console.error("Error generating ideas:", error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    });
  }
});

// Generate image endpoint
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `${prompt}, cinematic, high-resolution photography, professional color grading, sharp focus`,
      size: "1792x1024", // 16:9 aspect ratio
      quality: "hd",
      n: 1,
    });

    if (response.data && response.data.length > 0) {
      const imageUrl = response.data[0].url;
      res.json({ imageUrl });
    } else {
      throw new Error("No image was generated by the API.");
    }

  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'IQOS Catalyst API is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 IQOS Catalyst API server running on port ${port}`);
  console.log(`📊 Health check: http://localhost:${port}/api/health`);
  console.log(`🌐 Application: http://localhost:${port}`);
});
EOF
fi

# Set environment variables
export NODE_ENV=production
export OPENAI_API_KEY="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"

# Kill any process using port 3000
echo "🔪 Killing processes on port 3000..."
sudo lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Start with PM2
echo "🚀 Starting application with PM2..."
pm2 start server-production.js --name iqos-catalyst

# Save PM2 configuration
pm2 save

# Restart Nginx
echo "🔄 Restarting Nginx..."
sudo systemctl restart nginx

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 10

# Test the application
echo "🧪 Testing application..."
if curl -s http://localhost:3000/api/health > /dev/null; then
    echo "✅ API is working!"
else
    echo "❌ API not responding"
fi

echo ""
echo "📊 PM2 Status:"
pm2 status

echo ""
echo "🌐 Testing external access..."
curl -s https://iqos.buentipo.com/api/health && echo "✅ External API working!" || echo "❌ External API not responding"

echo ""
echo "✅ Fix completed!"
echo "🌐 Try accessing: https://iqos.buentipo.com"
echo "📊 Check logs with: pm2 logs iqos-catalyst"
