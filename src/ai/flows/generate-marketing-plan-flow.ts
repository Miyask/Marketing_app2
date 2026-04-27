
'use server';
/**
 * @fileOverview A GenAI flow for generating comprehensive Marketing Plans.
 *
 * - generateMarketingPlan - A function that handles the generation of a full marketing strategy.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MarketingPlanInputSchema = z.object({
  businessName: z.string().describe('The name of the business.'),
  industry: z.string().describe('The industry the business operates in.'),
  targetAudience: z.string().describe('Detailed description of the target audience.'),
  budget: z.string().describe('The monthly or campaign budget.'),
  objectives: z.string().describe('Primary objectives (e.g., brand awareness, conversion, loyalty).'),
});
export type MarketingPlanInput = z.infer<typeof MarketingPlanInputSchema>;

const MarketingPlanOutputSchema = z.object({
  strategyTitle: z.string(),
  executiveSummary: z.string(),
  swotAnalysis: z.object({
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
    opportunities: z.array(z.string()),
    threats: z.array(z.string()),
  }),
  recommendedChannels: z.array(z.object({
    name: z.string(),
    reasoning: z.string(),
    suggestedFormat: z.string(),
  })),
  contentCalendarPreview: z.array(z.object({
    week: z.string(),
    topic: z.string(),
    actionItem: z.string(),
  })),
  estimatedRoi: z.string().describe('Estimated ROI based on industry standards.'),
});
export type MarketingPlanOutput = z.infer<typeof MarketingPlanOutputSchema>;

export async function generateMarketingPlan(input: MarketingPlanInput): Promise<MarketingPlanOutput> {
  return generateMarketingPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMarketingPlanPrompt',
  input: { schema: MarketingPlanInputSchema },
  output: { schema: MarketingPlanOutputSchema },
  prompt: `You are a Senior Marketing Director. Create a high-level strategic marketing plan for:

Business: {{{businessName}}}
Industry: {{{industry}}}
Audience: {{{targetAudience}}}
Budget: {{{budget}}}
Objectives: {{{objectives}}}

Provide a comprehensive strategy including a SWOT analysis, channel recommendations, and a 4-week content calendar preview. Focus on practical, high-impact actions.`,
});

const generateMarketingPlanFlow = ai.defineFlow(
  {
    name: 'generateMarketingPlanFlow',
    inputSchema: MarketingPlanInputSchema,
    outputSchema: MarketingPlanOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) throw new Error('Failed to generate marketing plan');
    return output;
  }
);
