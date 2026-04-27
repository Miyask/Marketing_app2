'use server';
/**
 * @fileOverview A GenAI flow for generating marketing assets like ideas, slogans, and content outlines.
 *
 * - generateMarketingAssets - A function that handles the generation of marketing assets.
 * - GenerateMarketingAssetsInput - The input type for the generateMarketingAssets function.
 * - GenerateMarketingAssetsOutput - The return type for the generateMarketingAssets function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMarketingAssetsInputSchema = z.object({
  businessName: z.string().describe('The name of the business.'),
  industry: z.string().describe('The industry the business operates in.'),
  targetAudience: z
    .string()
    .describe('A description of the target audience for the business.'),
  keyFeatures: z
    .string()
    .describe(
      'Key features or unique selling propositions of the business.'
    ),
  marketingGoal: z
    .string()
    .describe('The primary goal for the marketing (e.g., brand awareness, lead generation, sales).'),
});
export type GenerateMarketingAssetsInput = z.infer<
  typeof GenerateMarketingAssetsInputSchema
>;

const GenerateMarketingAssetsOutputSchema = z.object({
  marketingIdeas: z
    .array(z.string())
    .describe('Tailored marketing strategies and ideas.'),
  slogans: z.array(z.string()).describe('Compelling slogans for the business.'),
  logoConcept: z
    .string()
    .describe('A foundational content outline or concept for a logo.'),
  brochureOutline: z
    .string()
    .describe(
      'A foundational content outline or concept for a brochure, including sections and key messages.'
    ),
});
export type GenerateMarketingAssetsOutput = z.infer<
  typeof GenerateMarketingAssetsOutputSchema
>;

export async function generateMarketingAssets(
  input: GenerateMarketingAssetsInput
): Promise<GenerateMarketingAssetsOutput> {
  return generateMarketingAssetsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMarketingAssetsPrompt',
  input: {schema: GenerateMarketingAssetsInputSchema},
  output: {schema: GenerateMarketingAssetsOutputSchema},
  prompt: `You are an expert marketing strategist and creative copywriter. Your task is to generate marketing assets based on the provided business details.

Business Name: {{{businessName}}}
Industry: {{{industry}}}
Target Audience: {{{targetAudience}}}
Key Features/USPs: {{{keyFeatures}}}
Marketing Goal: {{{marketingGoal}}}

Based on this information, provide the following:

1.  **Marketing Ideas**: Generate 3-5 innovative and tailored marketing strategies or campaigns. Focus on how the business can effectively reach its target audience and achieve its marketing goal.
2.  **Slogans**: Create 3-5 compelling, memorable, and concise slogans that capture the essence of the business and its unique selling propositions.
3.  **Logo Concept**: Provide a foundational concept or brief outline for a logo. Describe the visual elements, color palette suggestions, and the overall feeling or message it should convey.
4.  **Brochure Outline**: Develop a foundational content outline for a brochure. Include suggested sections (e.g., 'About Us', 'Our Services/Products', 'Key Benefits', 'Call to Action', 'Contact Info') and bullet points for the key messages within each section.`,
});

const generateMarketingAssetsFlow = ai.defineFlow(
  {
    name: 'generateMarketingAssetsFlow',
    inputSchema: GenerateMarketingAssetsInputSchema,
    outputSchema: GenerateMarketingAssetsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
