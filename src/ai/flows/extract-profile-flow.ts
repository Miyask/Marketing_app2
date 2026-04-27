
'use server';
/**
 * @fileOverview A GenAI flow for extracting business profile data from a URL using AI reasoning.
 */

import { ai, runAIQuery } from '@/ai/genkit';
import { z } from 'genkit';

const ExtractProfileInputSchema = z.object({
  url: z.string().url().describe('The URL of the business website to analyze.'),
  userConfig: z.object({
    modelId: z.string().optional(),
    googleApiKey: z.string().optional(),
    openaiApiKey: z.string().optional(),
    openrouterApiKey: z.string().optional(),
  }).optional(),
});
export type ExtractProfileInput = z.infer<typeof ExtractProfileInputSchema>;

const ExtractProfileOutputSchema = z.object({
  businessName: z.string().describe('The name of the business.'),
  owner: z.string().describe('The likely owner or key executive found.'),
  email: z.string().describe('Corporate contact email.'),
  phone: z.string().describe('Contact phone number.'),
  industry: z.string().describe('The industry sector.'),
  social: z.array(z.string()).describe('Social media presence detected.'),
  competitors: z.array(z.string()).describe('Direct competitors in the same niche.'),
  marketingGap: z.string().describe('A key marketing weakness identified from the site structure.'),
});
export type ExtractProfileOutput = z.infer<typeof ExtractProfileOutputSchema>;

export async function extractProfile(input: ExtractProfileInput): Promise<ExtractProfileOutput> {
  return extractProfileFlow(input);
}

const extractProfileFlow = ai.defineFlow(
  {
    name: 'extractProfileFlow',
    inputSchema: ExtractProfileInputSchema,
    outputSchema: ExtractProfileOutputSchema,
  },
  async (input) => {
    const modelId = input.userConfig?.modelId || 'googleai/gemini-2.0-flash-exp';
    
    const promptText = `You are an expert Digital Scout and OSINT Analyst. Your task is to analyze the following URL and extract detailed business intelligence.
URL: ${input.url}

Return ONLY a JSON object matching this schema:
{
  "businessName": "string",
  "owner": "string",
  "email": "string",
  "phone": "string",
  "industry": "string",
  "social": ["string"],
  "competitors": ["string"],
  "marketingGap": "string"
}`;

    const response = await runAIQuery({
      modelId,
      system: "You are an OSINT expert that only speaks JSON.",
      prompt: promptText,
      apiKey: input.userConfig?.googleApiKey,
      openaiKey: input.userConfig?.openaiApiKey,
      openrouterKey: input.userConfig?.openrouterApiKey,
      jsonMode: true
    });

    try {
      const cleanJson = response!.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanJson) as ExtractProfileOutput;
    } catch (e) {
      throw new Error('Failed to extract profile data due to invalid AI response.');
    }
  }
);
