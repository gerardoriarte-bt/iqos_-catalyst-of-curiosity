import { Brief, Idea } from '../types';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'http://18.117.222.96/api' 
  : 'http://localhost:3001/api';

export const generateMarketingIdeas = async (brief: Brief): Promise<Idea[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-ideas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ brief }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.ideas || [];
  } catch (error) {
    console.error("Error generating ideas:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate ideas: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating ideas.");
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!data.imageUrl) {
      throw new Error("No image URL received from the server.");
    }
    return data.imageUrl;
  } catch (error) {
    console.error("Error generating image:", error);
    if (error instanceof Error) {
      throw new Error(`Image generation failed: ${error.message}`);
    }
    throw new Error("An unknown error occurred during image generation.");
  }
};
