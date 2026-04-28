
'use server';
/**
 * @fileOverview A GenAI flow for extracting deep business intelligence and owner data from a URL.
 * Actually fetches the webpage HTML content and passes it to the AI for real analysis.
 *
 * - extractProfile - A function that handles the business scouting process.
 */

import { ai, runAIQuery } from '@/ai/genkit';
import { z } from 'genkit';
import * as cheerio from 'cheerio';

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

/**
 * Fetches a webpage and extracts readable text content, meta tags, and links.
 */
async function fetchWebpageContent(url: string): Promise<{
  text: string;
  title: string;
  metaDescription: string;
  metaKeywords: string;
  emails: string[];
  phones: string[];
  socialLinks: string[];
  headings: string[];
  links: string[];
}> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
      },
      signal: controller.signal,
      redirect: 'follow',
    });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove scripts, styles, and hidden elements
    $('script, style, noscript, iframe, svg, [hidden]').remove();

    const title = $('title').text().trim();
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    const metaKeywords = $('meta[name="keywords"]').attr('content') || '';

    // Extract headings
    const headings: string[] = [];
    $('h1, h2, h3').each((_, el) => {
      const text = $(el).text().trim();
      if (text) headings.push(text);
    });

    // Extract visible text from body
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim();

    // Extract emails from the page
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emails = [...new Set((html.match(emailRegex) || []).filter(e => !e.includes('example.com') && !e.includes('sentry')))];

    // Extract phone numbers
    const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g;
    const phones = [...new Set((html.match(phoneRegex) || []).filter(p => p.replace(/\D/g, '').length >= 9))];

    // Extract social media links
    const socialDomains = ['facebook.com', 'twitter.com', 'x.com', 'linkedin.com', 'instagram.com', 'youtube.com', 'tiktok.com', 'pinterest.com'];
    const socialLinks: string[] = [];
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href') || '';
      if (socialDomains.some(domain => href.includes(domain))) {
        socialLinks.push(href);
      }
    });

    // Extract all links
    const links: string[] = [];
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href') || '';
      if (href.startsWith('http')) links.push(href);
    });

    // Truncate body text to avoid token limits (keep first ~8000 chars)
    const truncatedText = bodyText.substring(0, 8000);

    return {
      text: truncatedText,
      title,
      metaDescription,
      metaKeywords,
      emails: emails.slice(0, 5),
      phones: phones.slice(0, 5),
      socialLinks: [...new Set(socialLinks)].slice(0, 10),
      headings: headings.slice(0, 20),
      links: links.slice(0, 30),
    };
  } catch (error) {
    console.error('Error fetching webpage:', error);
    return {
      text: `[Could not fetch the webpage at ${url}. The AI will analyze based on the URL pattern and domain name.]`,
      title: '',
      metaDescription: '',
      metaKeywords: '',
      emails: [],
      phones: [],
      socialLinks: [],
      headings: [],
      links: [],
    };
  }
}

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
    const modelId = input.userConfig?.modelId || 'googleai/gemini-2.0-flash';

    // Actually fetch the webpage content for real analysis
    const webData = await fetchWebpageContent(input.url);

    const promptText = `You are a Senior Digital Scout and OSINT Analyst. Your mission is to perform a deep tactical analysis of this website.

**TARGET URL**: ${input.url}

**SCRAPED PAGE TITLE**: ${webData.title || 'Not found'}

**META DESCRIPTION**: ${webData.metaDescription || 'Not found'}

**META KEYWORDS**: ${webData.metaKeywords || 'Not found'}

**PAGE HEADINGS**:
${webData.headings.length > 0 ? webData.headings.map(h => `- ${h}`).join('\n') : 'None found'}

**EMAILS FOUND ON PAGE**: ${webData.emails.length > 0 ? webData.emails.join(', ') : 'None found'}

**PHONES FOUND ON PAGE**: ${webData.phones.length > 0 ? webData.phones.join(', ') : 'None found'}

**SOCIAL MEDIA LINKS FOUND**:
${webData.socialLinks.length > 0 ? webData.socialLinks.map(l => `- ${l}`).join('\n') : 'None found'}

**EXTRACTED PAGE TEXT CONTENT**:
${webData.text}

---

Based on the REAL scraped data above, perform the following analysis:

1. Identify the "Human Behind the Brand": find the owner, CEO, or director's full name and their specific role from the page content.
2. Extract direct contact information (emails, phones found on the page).
3. Analyze the website for strengths and weaknesses.
4. Provide SEO and content analysis based on the actual meta tags and content.
5. Rate the website overall from 1-10.

If specific information cannot be found in the scraped data, indicate "No encontrado en la web" or provide your best analysis based on what IS available.

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
       system: "You are an expert in business intelligence, OSINT, and web analysis. You analyze REAL scraped webpage data. You only speak JSON.",
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
