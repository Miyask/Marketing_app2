
'use server';
/**
 * @fileOverview A GenAI flow for generating marketing assets like ideas, slogans, and content outlines.
 */

import { ai, runAIQuery } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateMarketingAssetsInputSchema = z.object({
  businessName: z.string().describe('The name of the business.'),
  industry: z.string().describe('The industry the business operates in.'),
  targetAudience: z.string().describe('A description of the target audience for the business.'),
  keyFeatures: z.string().describe('Key features or unique selling propositions of the business.'),
  marketingGoal: z.string().describe('The primary goal for the marketing (e.g., brand awareness, lead generation, sales).'),
  userConfig: z.object({
    modelId: z.string().optional(),
    googleApiKey: z.string().optional(),
    openaiApiKey: z.string().optional(),
    openrouterApiKey: z.string().optional(),
  }).optional(),
});
export type GenerateMarketingAssetsInput = z.infer<typeof GenerateMarketingAssetsInputSchema>;

const GenerateMarketingAssetsOutputSchema = z.object({
  marketingIdeas: z.array(z.string()).describe('Tailored marketing strategies and ideas.'),
  slogans: z.array(z.string()).describe('Compelling slogans for the business.'),
  logoConcept: z.string().describe('A foundational content outline or concept for a logo.'),
  brochureOutline: z.string().describe('A foundational content outline or concept for a brochure.'),
});
export type GenerateMarketingAssetsOutput = z.infer<typeof GenerateMarketingAssetsOutputSchema>;

export async function generateMarketingAssets(input: GenerateMarketingAssetsInput): Promise<GenerateMarketingAssetsOutput> {
  return generateMarketingAssetsFlow(input);
}

const generateMarketingAssetsFlow = ai.defineFlow(
  {
    name: 'generateMarketingAssetsFlow',
    inputSchema: GenerateMarketingAssetsInputSchema,
    outputSchema: GenerateMarketingAssetsOutputSchema,
  },
  async (input) => {
    const modelId = input.userConfig?.modelId || 'googleai/gemini-2.0-flash-exp';
    
    const promptText = `You are an expert marketing strategist and creative copywriter. Generate marketing assets for:
Business: ${input.businessName}
Industry: ${input.industry}
Target: ${input.targetAudience}
Goal: ${input.marketingGoal}

Return ONLY a JSON object matching this schema:
{
  "marketingIdeas": ["string"],
  "slogans": ["string"],
  "logoConcept": "string",
  "brochureOutline": "string"
}`;

     const response = await runAIQuery({
       modelId,
       system: "You are a creative director that only speaks JSON.",
       prompt: promptText,
       googleApiKey: input.userConfig?.googleApiKey,
       openaiApiKey: input.userConfig?.openaiApiKey,
       openrouterApiKey: input.userConfig?.openrouterApiKey,
       jsonMode: true
     });

    try {
      const cleanJson = response!.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanJson) as GenerateMarketingAssetsOutput;
    } catch (e) {
      throw new Error('Failed to generate assets due to invalid AI response.');
    }
  }
);
