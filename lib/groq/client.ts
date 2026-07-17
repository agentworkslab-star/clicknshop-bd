// Multi-provider AI client with automatic fallback
// Supports: Groq → LLM7.io (codestral-latest) → Mistral AI → OpenRouter
// No API key change required - just set the env var

import Groq from 'groq-sdk';

// Provider configurations
type Provider = 'groq' | 'llm7' | 'mistral' | 'openrouter';

interface ProviderConfig {
  baseURL: string;
  apiKey: string | undefined;
  model: string;
  name: string;
}

function getProviderConfig(): ProviderConfig {
  // Priority 1: LLM7.io (Boss-এর working key)
  if (process.env.LLM7_API_KEY) {
    return {
      baseURL: 'https://api.llm7.io/v1',
      apiKey: process.env.LLM7_API_KEY,
      model: process.env.LLM7_MODEL || 'codestral-latest',
      name: 'LLM7.io',
    };
  }
  // Priority 2: Groq (if works)
  if (process.env.GROQ_API_KEY) {
    return {
      baseURL: 'https://api.groq.com/openai/v1',
      apiKey: process.env.GROQ_API_KEY,
      model: 'llama-3.3-70b-versatile',
      name: 'Groq',
    };
  }
  // Priority 3: Mistral
  if (process.env.MISTRAL_API_KEY) {
    return {
      baseURL: 'https://api.mistral.ai/v1',
      apiKey: process.env.MISTRAL_API_KEY,
      model: 'mistral-small-latest',
      name: 'Mistral',
    };
  }
  // Priority 4: OpenRouter
  if (process.env.OPENROUTER_API_KEY) {
    return {
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY,
      model: 'meta-llama/llama-3.3-70b-instruct:free',
      name: 'OpenRouter',
    };
  }
  throw new Error(
    'No AI provider configured. Set one of: LLM7_API_KEY, GROQ_API_KEY, MISTRAL_API_KEY, or OPENROUTER_API_KEY'
  );
}

// OpenAI-compatible client (works with LLM7.io, Mistral, OpenRouter)
async function callOpenAICompatible(config: ProviderConfig, messages: any[], options: any = {}) {
  const response = await fetch(`${config.baseURL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.max_tokens ?? 2048,
      stream: false,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`${config.name} API ${response.status}: ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// Groq SDK client (legacy support)
function createGroqClient(apiKey?: string) {
  const key = apiKey || process.env.GROQ_API_KEY;
  if (!key) {
    throw new Error('GROQ_API_KEY not configured');
  }
  return new Groq({ apiKey: key });
}

// Unified generate function with automatic fallback
export async function generateCompletion(
  messages: any[],
  options: {
    temperature?: number;
    max_tokens?: number;
    model?: string;
  } = {}
): Promise<{ content: string; provider: string }> {
  const config = getProviderConfig();

  // Use specified model if provided
  const finalConfig = options.model
    ? { ...config, model: options.model }
    : config;

  try {
    const content = await callOpenAICompatible(finalConfig, messages, options);
    return { content, provider: config.name };
  } catch (error: any) {
    console.error(`[${config.name}] generation failed:`, error.message);

    // Try fallback providers
    const fallbacks = [
      { name: 'groq', env: 'GROQ_API_KEY', baseURL: 'https://api.groq.com/openai/v1', model: options.model || 'llama-3.3-70b-versatile' },
      { name: 'mistral', env: 'MISTRAL_API_KEY', baseURL: 'https://api.mistral.ai/v1', model: options.model || 'mistral-small-latest' },
      { name: 'openrouter', env: 'OPENROUTER_API_KEY', baseURL: 'https://openrouter.ai/api/v1', model: options.model || 'meta-llama/llama-3.3-70b-instruct:free' },
      { name: 'llm7', env: 'LLM7_API_KEY', baseURL: 'https://api.llm7.io/v1', model: 'codestral-latest' },
    ].filter(f => f.env !== `LLM7_API_KEY` || config.name !== 'LLM7.io'); // Don't retry same

    for (const fallback of fallbacks) {
      const key = process.env[fallback.env];
      if (!key) continue;

      try {
        console.log(`[Fallback] Trying ${fallback.name}...`);
        const content = await callOpenAICompatible(
          { baseURL: fallback.baseURL, apiKey: key, model: fallback.model, name: fallback.name },
          messages,
          options
        );
        return { content, provider: fallback.name };
      } catch (e: any) {
        console.error(`[${fallback.name}] failed:`, e.message);
      }
    }

    throw new Error(`All AI providers failed. Last error: ${error.message}`);
  }
}

// Streaming version (for future use)
export async function generateCompletionStream(
  messages: any[],
  options: any = {}
) {
  const config = getProviderConfig();
  const response = await fetch(`${config.baseURL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.max_tokens ?? 2048,
      stream: true,
    }),
  });

  if (!response.ok || !response.body) {
    throw new Error(`${config.name} API ${response.status}`);
  }

  return response.body;
}

export const GROQ_MODELS = {
  BEST: 'llama-3.3-70b-versatile',
  FAST: 'llama-3.1-8b-instant',
  LONG: 'mixtral-8x7b-32768',
  ALT: 'gemma2-9b-it',
} as const;

export type GroqModel = typeof GROQ_MODELS[keyof typeof GROQ_MODELS];

export const LLM7_MODELS = {
  CODESTRAL: 'codestral-latest',
  GPT_OSS: 'gpt-oss:20b',
  GPT_5_4_MINI: 'gpt-5.4-mini',
} as const;

export type LLM7Model = typeof LLM7_MODELS[keyof typeof LLM7_MODELS];

// Current active provider (for UI display)
export function getActiveProvider(): string {
  try {
    return getProviderConfig().name;
  } catch {
    return 'none';
  }
}