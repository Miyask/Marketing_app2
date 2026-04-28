'use server';

/**
 * Server action to check if a default Google AI API key is configured on the server.
 * This never exposes the actual key to the client.
 */
export async function hasDefaultGoogleKey(): Promise<boolean> {
  return !!(process.env.GOOGLE_GENAI_API_KEY && process.env.GOOGLE_GENAI_API_KEY.trim().length > 0);
}
