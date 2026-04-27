'use server';
/**
 * @fileOverview A GenAI flow for discovering and analyzing potential clients/leads.
 *
 * - discoverClients - A function that identifies potential leads based on industry and location.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DiscoverClientsInputSchema = z.object({
  sector: z.string().describe('The business sector or industry (e.g., Dentists, Restaurants).'),
  location: z.string().describe('The geographical area (e.g., Barcelona, Madrid, 28001).'),
  userConfig: z.object({
    modelId: z.string().optional(),
    apiKey: z.string().optional(),
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
  marketOverview: z.string().describe('Quick summary of the market opportunity in this area.')
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

Identify 5 highly realistic and representative potential clients in this area. For each one:
1. Provide a realistic business name.
2. Determine their "IA Status" based on common patterns for this industry (e.g., if it's a traditional business, they might lack a website).
3. Explain why they represent an opportunity for a marketing agency.

Focus on providing actionable intelligence that a salesperson can use to open a conversation.`,
});

const discoverClientsFlow = ai.defineFlow(
  {
    name: 'discoverClientsFlow',
    inputSchema: DiscoverClientsInputSchema,
    outputSchema: DiscoverClientsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input, {
      model: input.userConfig?.modelId || 'googleai/gemini-2.5-flash',
    });
    if (!output) throw new Error('Failed to discover clients');
    return output;
  }
);
