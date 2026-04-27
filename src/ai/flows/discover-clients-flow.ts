
'use server';
/**
 * @fileOverview A GenAI flow for discovering and analyzing potential clients/leads.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DiscoverClientsInputSchema = z.object({
  sector: z.string().describe('The business sector or industry.'),
  location: z.string().describe('The geographical area.'),
  userConfig: z.object({
    modelId: z.string().optional(),
    googleApiKey: z.string().optional(),
    openaiApiKey: z.string().optional(),
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

const prompt = ai.definePrompt({
  name: 'discoverClientsPrompt',
  input: { schema: DiscoverClientsInputSchema },
  output: { schema: DiscoverClientsOutputSchema },
  prompt: `You are an expert Sales Intelligence Agent. Your task is to perform a detailed market scan for:

Sector: {{{sector}}}
Location: {{{location}}}

Identify 5 highly realistic potential clients in this area. Focus on providing actionable intelligence. 
If specific business names are not available in your training data, use highly probable business names for that niche and location.`,
});

const discoverClientsFlow = ai.defineFlow(
  {
    name: 'discoverClientsFlow',
    inputSchema: DiscoverClientsInputSchema,
    outputSchema: DiscoverClientsOutputSchema,
  },
  async (input) => {
    const modelId = input.userConfig?.modelId || 'googleai/gemini-2.0-flash-exp';
    
    const { output } = await prompt(input, {
      model: modelId,
    });
    
    if (!output) throw new Error('Failed to discover clients');
    return output;
  }
);
