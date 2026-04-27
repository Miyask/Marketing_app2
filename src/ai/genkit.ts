
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Global Genkit instance configured with the Google AI plugin.
 * Handles the core AI logic for Gemini models.
 * Note: Removed 'use server' to allow exporting the 'ai' object.
 */
export const ai = genkit({
  plugins: [
    googleAI()
  ],
  model: 'googleai/gemini-2.0-flash-exp',
});

/**
 * A flexible AI Router that can handle multiple providers (Google, OpenAI, OpenRouter).
 * This function is the central bridge for all AI interactions in the app.
 */
export async function runAIQuery(params: {
  modelId: string;
  system?: string;
  prompt: string;
  apiKey?: string;
  openaiKey?: string;
  openrouterKey?: string;
  jsonMode?: boolean;
}) {
  const { modelId, prompt, system, apiKey, openaiKey, openrouterKey, jsonMode } = params;

  // 1. Handle Google Gemini models directly via Genkit
  if (modelId.startsWith('googleai/')) {
    const { text } = await ai.generate({
      model: modelId,
      system,
      prompt,
      config: {
        maxOutputTokens: 2048,
        temperature: 0.7,
      }
    });
    return text;
  }

  // 2. Handle OpenAI models via fetch to OpenAI API
  if (modelId.startsWith('openai/')) {
    const realModelId = modelId.replace('openai/', '');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey || process.env.OPENAI_API_KEY || ''}`
      },
      body: JSON.stringify({
        model: realModelId,
        messages: [
          ...(system ? [{ role: 'system', content: system }] : []),
          { role: 'user', content: prompt }
        ],
        ...(jsonMode ? { response_format: { type: 'json_object' } } : {})
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(`OpenAI Error: ${data.error.message}`);
    return data.choices[0].message.content;
  }

  // 3. Handle OpenRouter models (Qwen, Llama, Claude, DeepSeek, etc.)
  if (modelId.startsWith('openrouter/')) {
    const realModelId = modelId.replace('openrouter/', '');
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openrouterKey || process.env.OPENROUTER_API_KEY || ''}`,
        'HTTP-Referer': 'https://marketscout-pro.app',
        'X-Title': 'MarketScout Pro'
      },
      body: JSON.stringify({
        model: realModelId,
        messages: [
          ...(system ? [{ role: 'system', content: system }] : []),
          { role: 'user', content: prompt }
        ],
        ...(jsonMode ? { response_format: { type: 'json_object' } } : {})
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(`OpenRouter Error: ${data.error.message}`);
    return data.choices[0].message.content;
  }

  throw new Error(`Unsupported model provider: ${modelId}`);
}
