import { GoogleGenAI, Type } from "@google/genai";
import { Brief, Idea } from '../types';

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

const getPrompt = (brief: Brief) => `
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
`;

const ideaSchema = {
  type: Type.OBJECT,
  properties: {
    ideaTitle: { type: Type.STRING, description: "A provocative and captivating title, often framed as a 'What if...?' question." },
    conceptDescription: { type: Type.STRING, description: "A detailed, immersive description of the concept (3-4 sentences)." },
    executionFormat: { type: Type.STRING, description: "Clearly label the format (e.g., Digital/Social Media, Offline/Retail, BTL, Experiential Event)." },
    keyStrategicDrivers: {
      type: Type.OBJECT,
      properties: {
        curiosityTrigger: { type: Type.STRING, description: "Explain how the idea employs the selected Curiosity Trigger." },
        brandTrait: { type: Type.STRING, description: "Detail how the idea manifests the chosen Primary Takeaway." },
      },
      required: ['curiosityTrigger', 'brandTrait']
    },
    experienceExplorersResonance: {
        type: Type.OBJECT,
        properties: {
            appeal: { type: Type.STRING, description: "Explain how this idea specifically appeals to the Experience Explorers (LANU-29), referencing their values like style, non-conformity, or the thrill of discovery." },
            dimensions: { type: Type.STRING, description: "Briefly mention the Cognitive, Emotional, Motivational, and Cultural dimensions it activates." },
        },
        required: ['appeal', 'dimensions']
    },
    whatIf: { type: Type.STRING, description: "Frame the open-ended question or the unresolved tension the idea creates, embodying the core 'pleasure of uncertainty' strategy." },
    visualPrompt: { type: Type.STRING, description: "A detailed, artistic prompt for an image generation model, capturing the idea's essence with an IQOS aesthetic." },
  },
  required: ['ideaTitle', 'conceptDescription', 'executionFormat', 'keyStrategicDrivers', 'experienceExplorersResonance', 'whatIf', 'visualPrompt']
};

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        ideas: {
            type: Type.ARRAY,
            items: ideaSchema
        }
    },
    required: ['ideas']
}


export const generateMarketingIdeas = async (brief: Brief): Promise<Idea[]> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: getPrompt(brief),
    config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.8,
    }
  });
  
  const text = response.text.trim();
  try {
    const jsonResponse = JSON.parse(text);
    return jsonResponse.ideas || [];
  } catch (e) {
    console.error("Failed to parse JSON response:", text);
    throw new Error("Received an invalid response from the AI. The format was not correct.");
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: `${prompt}, cinematic, high-resolution photography, professional color grading, sharp focus`,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '16:9',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
      throw new Error("No image was generated by the API.");
    }
  } catch (error) {
    console.error("Error generating image:", error);
    if (error instanceof Error) {
        throw new Error(`Image generation failed: ${error.message}`);
    }
    throw new Error("An unknown error occurred during image generation.");
  }
};
