
'use server';
/**
 * @fileOverview A GenAI flow for generating comprehensive Marketing Plans.
 *
 * - generateMarketingPlan - A function that handles the generation of a full marketing strategy.
 */

import { ai, runAIQuery } from '@/ai/genkit';
import { z } from 'genkit';

const MarketingPlanInputSchema = z.object({
  businessName: z.string().describe('The name of the business.'),
  industry: z.string().describe('The industry the business operates in.'),
  targetAudience: z.string().describe('Detailed description of the target audience.'),
  budget: z.string().describe('The monthly or campaign budget.'),
  objectives: z.string().describe('Primary objectives.'),
  userConfig: z.object({
    modelId: z.string().optional(),
    googleApiKey: z.string().optional(),
    openaiApiKey: z.string().optional(),
    openrouterApiKey: z.string().optional(),
  }).optional(),
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

const generateMarketingPlanFlow = ai.defineFlow(
  {
    name: 'generateMarketingPlanFlow',
    inputSchema: MarketingPlanInputSchema,
    outputSchema: MarketingPlanOutputSchema,
  },
  async (input) => {
    const modelId = input.userConfig?.modelId || 'googleai/gemini-2.5-flash';
    
    const promptText = `You are a Senior Marketing Director. Create a high-level strategic marketing plan for:

Business: ${input.businessName}
Industry: ${input.industry}
Audience: ${input.targetAudience}
Budget: ${input.budget}
Objectives: ${input.objectives}

Return ONLY a JSON object that matches this schema:
{
  "strategyTitle": "string",
  "executiveSummary": "string",
  "swotAnalysis": {
    "strengths": ["string"],
    "weaknesses": ["string"],
    "opportunities": ["string"],
    "threats": ["string"]
  },
  "recommendedChannels": [
    { "name": "string", "reasoning": "string", "suggestedFormat": "string" }
  ],
  "contentCalendarPreview": [
    { "week": "string", "topic": "string", "actionItem": "string" }
  ],
  "estimatedRoi": "string"
}`;

     const response = await runAIQuery({
       modelId,
       system: "You are an expert marketing strategist that only speaks JSON.",
       prompt: promptText,
       googleApiKey: input.userConfig?.googleApiKey,
       openaiApiKey: input.userConfig?.openaiApiKey,
       openrouterApiKey: input.userConfig?.openrouterApiKey,
       jsonMode: true
     });

    try {
      const cleanJson = response!.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (parsed.swotAnalysis) {
        for (const key of ['strengths', 'weaknesses', 'opportunities', 'threats']) {
          if (!Array.isArray(parsed.swotAnalysis[key])) {
            parsed.swotAnalysis[key] = parsed.swotAnalysis[key] ? [parsed.swotAnalysis[key]] : [];
          }
        }
      }
      if (!Array.isArray(parsed.recommendedChannels)) parsed.recommendedChannels = [];
      if (!Array.isArray(parsed.contentCalendarPreview)) parsed.contentCalendarPreview = [];
      return parsed as MarketingPlanOutput;
    } catch (e) {
      console.error("Failed to parse AI response:", response?.substring(0, 500));
      throw new Error('Failed to generate marketing plan due to invalid AI response format.');
    }
  }
);
