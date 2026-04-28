
'use server';
/**
 * @fileOverview A GenAI flow for discovering and analyzing potential clients/leads.
 */

import { ai, runAIQuery } from '@/ai/genkit';
import { z } from 'genkit';

const DiscoverClientsInputSchema = z.object({
  sector: z.string().describe('The business sector or industry.'),
  location: z.string().describe('The geographical area.'),
  userConfig: z.object({
    modelId: z.string().optional(),
    googleApiKey: z.string().optional(),
    openaiApiKey: z.string().optional(),
    openrouterApiKey: z.string().optional(),
  }).optional(),
});
export type DiscoverClientsInput = z.infer<typeof DiscoverClientsInputSchema>;

const DiscoverClientsOutputSchema = z.object({
  leads: z.array(z.object({
    name: z.string().describe('Name of the business.'),
    location: z.string().describe('Specific area or street.'),
    sector: z.string().describe('Refined sector.'),
    rating: z.number().describe('Estimated online reputation score (1-5).'),
    status: z.enum(['Sin Marketing', 'Lead Caliente', 'Sin Web', 'Competidor', 'Baja Presencia RRSS']).describe('Marketing status determined by AI.'),
    description: z.string().describe('Brief reason why they are a good lead.'),
    suggestedAction: z.string().describe('First step to take with this lead.')
  })),
  marketOverview: z.string().describe('Quick summary of the market opportunity.')
});
export type DiscoverClientsOutput = z.infer<typeof DiscoverClientsOutputSchema>;

export async function discoverClients(input: DiscoverClientsInput): Promise<DiscoverClientsOutput> {
  return discoverClientsFlow(input);
}

const discoverClientsFlow = ai.defineFlow(
  {
    name: 'discoverClientsFlow',
    inputSchema: DiscoverClientsInputSchema,
    outputSchema: DiscoverClientsOutputSchema,
  },
  async (input) => {
    const modelId = input.userConfig?.modelId || 'googleai/gemini-2.0-flash-exp';
    
    const promptText = `You are an expert Sales Intelligence Agent. Your task is to perform a detailed market scan for:
Sector: ${input.sector}
Location: ${input.location}

Identify 5 highly realistic potential clients in this area. Focus on providing actionable intelligence.

Return ONLY a JSON object matching this schema:
{
  "leads": [
    {
      "name": "string",
      "location": "string",
      "sector": "string",
      "rating": number,
      "status": "Sin Marketing" | "Lead Caliente" | "Sin Web" | "Competidor" | "Baja Presencia RRSS",
      "description": "string",
      "suggestedAction": "string"
    }
  ],
  "marketOverview": "string"
}`;

     const response = await runAIQuery({
       modelId,
       system: "You are a sales intelligence expert that only speaks JSON.",
       prompt: promptText,
       googleApiKey: input.userConfig?.googleApiKey,
       openaiApiKey: input.userConfig?.openaiApiKey,
       openrouterApiKey: input.userConfig?.openrouterApiKey,
       jsonMode: true
     });

    try {
      const cleanJson = response!.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanJson) as DiscoverClientsOutput;
    } catch (e) {
      throw new Error('Failed to discover clients due to invalid AI response.');
    }
  }
);
