# Environment Configuration for Development

## Local Development (Gemini API)
Create a `.env.local` file in the project root:

```bash
# Gemini API Key for local development
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: OpenAI API Key (for production)
OPENAI_API_KEY=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
```

## Production Environment (OpenAI API)
For production deployment, use OpenAI API:

```bash
# OpenAI API Key for production
OPENAI_API_KEY=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

# Environment
NODE_ENV=production
```

## Development Commands

```bash
# Install dependencies
npm install

# Set up Gemini API key for local development
echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env.local

# Run development server (uses Gemini)
npm run dev

# Build for production (uses OpenAI)
npm run build
```

## API Usage Strategy

- **Local Development**: Gemini API (free tier, no browser restrictions)
- **Production**: OpenAI API (better performance, structured responses)
- **Fallback**: Both APIs available for testing and comparison
