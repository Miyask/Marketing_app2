
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
  strengths: z.array(z.string()).describe('List of identified strengths of the website (design, content, functionality, etc.).'),
  technicalWeaknesses: z.array(z.string()).describe('List of technical weaknesses (slow loading, broken links, mobile issues, etc.).'),
  marketingWeaknesses: z.array(z.string()).describe('List of marketing weaknesses (poor SEO, weak CTAs, lack of social proof, etc.).'),
  uxWeaknesses: z.array(z.string()).describe('List of UX/UI weaknesses (confusing navigation, poor accessibility, etc.).'),
  improvementOpportunities: z.array(z.string()).describe('List of specific opportunities for improvement.'),
  contentAnalysis: z.string().describe('Analysis of the website content quality and relevance.'),
  seoAnalysis: z.string().describe('Basic SEO analysis including meta tags, keywords, and structure.'),
  overallScore: z.number().describe('Overall website score from 1-10 based on the analysis.'),
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

Additionally, perform a comprehensive website analysis covering:
- STRENGTHS: What does this website do well? (design, content, functionality, user experience, etc.)
- TECHNICAL WEAKNESSES: Technical issues (loading speed, mobile responsiveness, broken links, etc.)
- MARKETING WEAKNESSES: Marketing gaps (SEO, CTAs, social proof, content strategy, etc.)
- UX/UI WEAKNESSES: User experience issues (navigation, accessibility, clarity, etc.)
- IMPROVEMENT OPPORTUNITIES: Specific actionable improvements
- CONTENT ANALYSIS: Quality and relevance of the content
- SEO ANALYSIS: Basic SEO assessment (meta tags, keywords, structure)
- OVERALL SCORE: Rate the website from 1-10 based on the analysis

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
  "suggestedApproach": "string",
  "strengths": ["string"],
  "technicalWeaknesses": ["string"],
  "marketingWeaknesses": ["string"],
  "uxWeaknesses": ["string"],
  "improvementOpportunities": ["string"],
  "contentAnalysis": "string",
  "seoAnalysis": "string",
  "overallScore": number
}`;

     const response = await runAIQuery({
       modelId,
       system: "You are an expert in business intelligence and web scraping simulation. You only speak JSON.",
       prompt: promptText,
       googleApiKey: input.userConfig?.googleApiKey,
       openaiApiKey: input.userConfig?.openaiApiKey,
       openrouterApiKey: input.userConfig?.openrouterApiKey,
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
