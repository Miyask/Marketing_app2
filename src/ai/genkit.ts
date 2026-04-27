
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Global Genkit instance configured with the Google AI plugin.
 * Handles the core AI logic for Gemini models.
 */
export const ai = genkit({
  plugins: [
    googleAI()
  ],
  model: 'googleai/gemini-2.0-flash-exp',
});

/**
 * A robust AI Router that can handle multiple providers (Google, OpenAI, OpenRouter).
 * This function handles the secure communication with AI APIs.
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

  // 1. Google Gemini via Genkit
  if (modelId.startsWith('googleai/')) {
    const { text } = await ai.generate({
      model: modelId,
      system,
      prompt,
      config: {
        maxOutputTokens: 4096,
        temperature: 0.7,
      }
    });
    return text;
  }

  // 2. OpenAI via direct Fetch (no extra dependencies needed)
  if (modelId.startsWith('openai/')) {
    const realModelId = modelId.replace('openai/', '');
    const finalApiKey = openaiKey || process.env.OPENAI_API_KEY;
    
    if (!finalApiKey) throw new Error("OpenAI API Key missing.");

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${finalApiKey}`
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

  // 3. OpenRouter (Llama, Claude, Qwen, DeepSeek, Grok)
  if (modelId.startsWith('openrouter/')) {
    const realModelId = modelId.replace('openrouter/', '');
    const finalApiKey = openrouterKey || process.env.OPENROUTER_API_KEY;

    if (!finalApiKey) throw new Error("OpenRouter API Key missing.");

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${finalApiKey}`,
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
