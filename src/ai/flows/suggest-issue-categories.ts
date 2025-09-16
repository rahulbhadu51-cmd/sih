'use server';

/**
 * @fileOverview Suggests appropriate categories and sub-categories for a reported issue based on the description and photo.
 *
 * - suggestIssueCategories - A function that handles the issue category suggestion process.
 * - SuggestIssueCategoriesInput - The input type for the suggestIssueCategories function.
 * - SuggestIssueCategoriesOutput - The return type for the suggestIssueCategories function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestIssueCategoriesInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the issue, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().describe('The description of the issue.'),
});
export type SuggestIssueCategoriesInput = z.infer<typeof SuggestIssueCategoriesInputSchema>;

const SuggestIssueCategoriesOutputSchema = z.object({
  suggestedCategories: z
    .array(z.string())
    .describe('Suggested categories for the issue.'),
  suggestedSubcategories: z
    .array(z.string())
    .describe('Suggested subcategories for the issue.'),
});
export type SuggestIssueCategoriesOutput = z.infer<typeof SuggestIssueCategoriesOutputSchema>;

export async function suggestIssueCategories(
  input: SuggestIssueCategoriesInput
): Promise<SuggestIssueCategoriesOutput> {
  return suggestIssueCategoriesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestIssueCategoriesPrompt',
  input: {schema: SuggestIssueCategoriesInputSchema},
  output: {schema: SuggestIssueCategoriesOutputSchema},
  prompt: `You are an expert municipal issue classifier. Given a photo and a description of the issue, suggest appropriate categories and sub-categories for the issue.

Choose from the following categories:
- Cleanliness & Sanitation
- Water Supply & Drainage
- Roads & Street Lighting
- Public Health & Hygiene
- Other Issues

Description: {{{description}}}
Photo: {{media url=photoDataUri}}

Based on the information, provide a primary category and related sub-category details.`,
});

const suggestIssueCategoriesFlow = ai.defineFlow(
  {
    name: 'suggestIssueCategoriesFlow',
    inputSchema: SuggestIssueCategoriesInputSchema,
    outputSchema: SuggestIssueCategoriesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
