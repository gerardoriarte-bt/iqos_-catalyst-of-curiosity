# Environment Configuration

## Development Environment Variables

Create a `.env.local` file in the project root with the following variables:

```bash
# OpenAI API Configuration
OPENAI_API_KEY=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

# Optional: Gemini API (for fallback or comparison)
GEMINI_API_KEY=your_gemini_api_key_here
```

## Production Environment Variables

For production deployment, set these environment variables in your hosting platform:

### Required Variables:
- `OPENAI_API_KEY`: Your OpenAI API key
- `NODE_ENV`: Set to "production"

### Optional Variables:
- `VITE_APP_TITLE`: Custom app title
- `VITE_APP_DESCRIPTION`: Custom app description

## Security Notes

⚠️ **IMPORTANT**: Never commit API keys to version control. The `.env.local` file is already in `.gitignore`.

## Environment Setup Commands

```bash
# Install dependencies
npm install

# Set up environment (create .env.local file)
echo "OPENAI_API_KEY=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" > .env.local

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```
