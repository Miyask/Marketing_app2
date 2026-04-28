
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const plugins: any[] = [];

// Only initialize Google AI plugin if API key is available (either env or will be provided per-request)
// The runAIQuery function handles user-provided keys directly via fetch, so this plugin is only needed for ai.defineFlow internal usage.
if (process.env.GOOGLE_GENAI_API_KEY) {
  plugins.push(googleAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY }));
}

/**
 * Global Genkit instance.
 * Used for defining flows; actual generation is handled via runAIQuery.
 */
export const ai = genkit({
  plugins,
  model: plugins.length > 0 ? 'googleai/gemini-2.5-flash' : undefined,
});

/**
 * Helper to determine if a value is a non-empty string
 */
function hasValue(val: string | undefined | null): val is string {
  return typeof val === 'string' && val.trim().length > 0;
}

/**
 * A robust AI Router that can handle multiple providers (Google, OpenAI, OpenRouter).
 * Uses user-provided API keys when available, falls back to environment variables.
 */
export async function runAIQuery(params: {
  modelId: string;
  system?: string;
  prompt: string;
  googleApiKey?: string;
  openaiApiKey?: string;
  openrouterApiKey?: string;
  jsonMode?: boolean;
}) {
  const { modelId, prompt, system, googleApiKey, openaiApiKey, openrouterApiKey, jsonMode } = params;

  // 1. Google Gemini via direct REST API (respects user-provided keys)
  if (modelId.startsWith('googleai/')) {
    const finalGoogleApiKey = googleApiKey || process.env.GOOGLE_GENAI_API_KEY;
    if (!hasValue(finalGoogleApiKey)) {
      throw new Error("Google API Key missing. Please configure your Google AI key in settings.");
    }

    const realModelId = modelId.replace('googleai/', '');
    const maxRetries = 3;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const requestBody: any = {
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: 8192,
            temperature: 0.7,
          },
        };

        if (jsonMode) {
          requestBody.generationConfig.responseMimeType = 'application/json';
        }

        if (system) {
          requestBody.systemInstruction = { parts: [{ text: system }] };
        }

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${realModelId}:generateContent?key=${finalGoogleApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
          }
        );

        if (response.status === 429 && attempt < maxRetries) {
          const retryData = await response.json();
          const retryMatch = retryData.error?.message?.match(/retry in ([\d.]+)s/i);
          const waitSec = retryMatch ? Math.min(parseFloat(retryMatch[1]), 60) : (attempt + 1) * 15;
          console.log(`Rate limited (attempt ${attempt + 1}/${maxRetries}), waiting ${waitSec}s...`);
          await new Promise(r => setTimeout(r, waitSec * 1000));
          continue;
        }

        const data = await response.json();
        if (!response.ok) {
          if (response.status === 429) {
            throw new Error("Cuota de API agotada. Tu clave de Google AI ha alcanzado el límite diario gratuito. Espera unas horas o habilita la facturación en Google AI Studio.");
          }
          throw new Error(`Google AI Error: ${data.error?.message || JSON.stringify(data)}`);
        }
        const parts = data.candidates?.[0]?.content?.parts || [];
        const textPart = parts.filter((p: any) => p.text !== undefined).pop();
        return textPart?.text || '';
      } catch (error) {
        if (attempt === maxRetries || !(error instanceof Error) || !error.message.includes('429')) {
          console.error('Google AI Error:', error);
          const msg = error instanceof Error ? error.message : 'Unknown error';
          if (msg.includes('quota') || msg.includes('Cuota')) {
            throw new Error(msg);
          }
          throw new Error(`Google AI Error: ${msg}`);
        }
      }
    }
    throw new Error("Google AI Error: Max retries exceeded due to rate limiting.");
  }

  // 2. OpenAI via direct Fetch
  if (modelId.startsWith('openai/')) {
    const realModelId = modelId.replace('openai/', '');
    const finalApiKey = openaiApiKey || process.env.OPENAI_API_KEY;
    if (!hasValue(finalApiKey)) {
      throw new Error("OpenAI API Key missing. Please configure your OpenAI key in settings.");
    }

    try {
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
      if (!response.ok) {
        throw new Error(`OpenAI Error: ${data.error?.message || JSON.stringify(data)}`);
      }
      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI Error:', error);
      throw new Error(`OpenAI Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // 3. OpenRouter (Llama, Claude, Qwen, DeepSeek, Grok)
  if (modelId.startsWith('openrouter/')) {
    const realModelId = modelId.replace('openrouter/', '');
    const finalApiKey = openrouterApiKey || process.env.OPENROUTER_API_KEY;
    if (!hasValue(finalApiKey)) {
      throw new Error("OpenRouter API Key missing. Please configure your OpenRouter key in settings.");
    }

    try {
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
      if (!response.ok) {
        throw new Error(`OpenRouter Error: ${data.error?.message || JSON.stringify(data)}`);
      }
      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenRouter Error:', error);
      throw new Error(`OpenRouter Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  throw new Error(`Unsupported model provider: ${modelId}`);
}
