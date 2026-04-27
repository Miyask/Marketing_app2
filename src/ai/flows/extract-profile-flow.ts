
'use server';
/**
 * @fileOverview A GenAI flow for extracting deep business intelligence and owner data from a URL.
 *
 * - extractProfile - A function that handles the business scouting process.
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
  businessName: z.string().describe('The official name of the business.'),
  ownerName: z.string().describe('The full name of the owner, CEO, or key decision maker.'),
  ownerRole: z.string().describe('The specific title of the identified person.'),
  email: z.string().describe('The primary contact or corporate email address.'),
  phone: z.string().describe('The contact phone number.'),
  industry: z.string().describe('The specific industry niche.'),
  socialLinks: z.array(z.string()).describe('List of detected social media profiles.'),
  competitors: z.array(z.string()).describe('Identified direct competitors.'),
  marketingGap: z.string().describe('A critical marketing weakness or opportunity identified.'),
  suggestedApproach: z.string().describe('A recommended first message or approach strategy.'),
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
    
    const promptText = `You are a Senior Digital Scout and OSINT Analyst. Your mission is to perform a deep tactical analysis of this URL: ${input.url}

Identify the "Human Behind the Brand": find the owner, CEO, or director's full name and their specific role. Extract direct contact information and analyze their market positioning.

Return ONLY a JSON object matching this schema:
{
  "businessName": "string",
  "ownerName": "string",
  "ownerRole": "string",
  "email": "string",
  "phone": "string",
  "industry": "string",
  "socialLinks": ["string"],
  "competitors": ["string"],
  "marketingGap": "string",
  "suggestedApproach": "string"
}`;

    const response = await runAIQuery({
      modelId,
      system: "You are an expert in business intelligence and web scraping simulation. You only speak JSON.",
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
