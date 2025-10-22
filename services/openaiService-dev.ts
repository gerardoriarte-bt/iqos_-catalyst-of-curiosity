import OpenAI from 'openai';
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

export const generateMarketingIdeas = async (brief: Brief): Promise<Idea[]> => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY environment variable is not set.");
  }
  
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true, // ⚠️ ONLY for development - remove in production
  });

  try {
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

    try {
      const jsonResponse = JSON.parse(content);
      return jsonResponse.ideas || [];
    } catch (e) {
      console.error("Failed to parse JSON response:", content);
      throw new Error("Received an invalid response from the AI. The format was not correct.");
    }
  } catch (error) {
    console.error("OpenAI API error:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate ideas: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating ideas.");
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY environment variable is not set.");
  }
  
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true, // ⚠️ ONLY for development - remove in production
  });

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `${prompt}, cinematic, high-resolution photography, professional color grading, sharp focus`,
      size: "1792x1024", // 16:9 aspect ratio
      quality: "hd",
      n: 1,
    });

    if (response.data && response.data.length > 0) {
      const imageUrl = response.data[0].url;
      if (!imageUrl) {
        throw new Error("No image URL received from OpenAI.");
      }
      return imageUrl;
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
