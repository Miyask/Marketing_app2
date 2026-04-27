
'use server';
/**
 * @fileOverview A GenAI flow for extracting business profile data from a URL using AI reasoning.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ExtractProfileInputSchema = z.object({
  url: z.string().url().describe('The URL of the business website to analyze.'),
  userConfig: z.object({
    modelId: z.string().optional(),
    apiKey: z.string().optional(),
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

const prompt = ai.definePrompt({
  name: 'extractProfilePrompt',
  input: { schema: ExtractProfileInputSchema },
  output: { schema: ExtractProfileOutputSchema },
  prompt: `You are an expert Digital Scout and OSINT Analyst. Your task is to analyze the following URL and extract detailed business intelligence as if you had crawled the site.

URL: {{{url}}}

Provide realistic business data including the likely owner, contact details, and a competitive analysis. If specific details aren't explicitly available, use your knowledge of this business or similar businesses in that niche to provide the most likely information.`,
});

const extractProfileFlow = ai.defineFlow(
  {
    name: 'extractProfileFlow',
    inputSchema: ExtractProfileInputSchema,
    outputSchema: ExtractProfileOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input, {
      model: input.userConfig?.modelId || 'googleai/gemini-2.0-flash-exp',
    });
    if (!output) throw new Error('Failed to extract profile data');
    return output;
  }
);
