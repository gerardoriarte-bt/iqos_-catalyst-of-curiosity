export const PRIMARY_TAKEAWAYS = [
  'Match their rhythm',
  'Stay stylish',
  'Be bold',
  'Keep surprising',
];

export const CURIOSITY_TRIGGERS = [
  'Information Gap',
  'Mental Challenge',
  'FOMO',
  'Mystery',
  'Perceptual Curiosity',
  'Reward System',
  'Shared Symbols',
  'Imitation',
];

export const IQOS_COUNTRIES = [
  'Global (No specific country)',
  'Japan',
  'Italy',
  'Switzerland',
  'Germany',
  'South Korea',
  'United Kingdom',
  'Canada',
  'Colombia',
  'South Africa',
  'Malaysia',
];

// New: Suggestions for contextual feedback in the form
export const COUNTRY_SUGGESTIONS: Record<string, { takeaways: string[], triggers: string[] }> = {
  'Japan': {
    takeaways: ['Keep surprising', 'Stay stylish'],
    triggers: ['Imitation', 'Shared Symbols', 'Reward System'],
  },
  'Italy': {
    takeaways: ['Be bold', 'Match their rhythm'],
    triggers: ['Perceptual Curiosity', 'Mystery', 'FOMO'],
  },
   'South Korea': {
    takeaways: ['Stay stylish', 'Be bold'],
    triggers: ['FOMO', 'Imitation', 'Shared Symbols'],
  },
};
