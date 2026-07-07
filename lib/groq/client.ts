import Groq from 'groq-sdk';

export function createGroqClient(apiKey?: string) {
  const key = apiKey || process.env.GROQ_API_KEY;
  if (!key) {
    throw new Error('GROQ_API_KEY not configured');
  }
  return new Groq({ apiKey: key });
}

export const GROQ_MODELS = {
  BEST: 'llama-3.3-70b-versatile',
  FAST: 'llama-3.1-8b-instant',
  LONG: 'mixtral-8x7b-32768',
  ALT: 'gemma2-9b-it',
} as const;

export type GroqModel = typeof GROQ_MODELS[keyof typeof GROQ_MODELS];