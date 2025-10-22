// API Configuration
// This file manages which API service to use based on environment

import { generateMarketingIdeas as geminiGenerateIdeas, generateImage as geminiGenerateImage } from './geminiService';
import { generateMarketingIdeas as openaiGenerateIdeas, generateImage as openaiGenerateImage } from './openaiService';
import { generateMarketingIdeas as apiGenerateIdeas, generateImage as apiGenerateImage } from './apiService';

// Determine which API to use based on environment
const USE_OPENAI = process.env.NODE_ENV === 'production' || process.env.USE_OPENAI === 'true';
const USE_BACKEND_API = process.env.NODE_ENV === 'production';

// For production: Use backend API (secure)
// For development: Use Gemini API (no browser restrictions)
const generateMarketingIdeas = USE_BACKEND_API ? apiGenerateIdeas : geminiGenerateIdeas;
const generateImage = USE_BACKEND_API ? apiGenerateImage : geminiGenerateImage;

// Log which API is being used
if (typeof window !== 'undefined') {
  console.log(`🤖 Using ${USE_BACKEND_API ? 'Backend API (OpenAI)' : 'Gemini'} API for ${process.env.NODE_ENV || 'development'}`);
}

export { generateMarketingIdeas, generateImage };
