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

// Authentication types
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
}
