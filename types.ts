export interface Brief {
  primaryTakeaway: string;
  curiosityTrigger: string;
  country: string;
}

export interface Idea {
  ideaTitle: string;
  conceptDescription: string;
  executionFormat: string;
  keyStrategicDrivers: {
    curiosityTrigger: string;
    brandTrait: string;
  };
  experienceExplorersResonance: {
    appeal: string;
    dimensions: string;
  };
  whatIf: string;
  visualPrompt: string;

  // UI-managed state for image generation
  imageUrl?: string;
  isImageLoading?: boolean;
  imageError?: string;
}
