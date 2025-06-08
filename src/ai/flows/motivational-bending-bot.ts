// src/ai/flows/motivational-bending-bot.ts
'use server';
/**
 * @fileOverview A motivational message generator tailored to the user's progress and elemental affinity.
 *
 * - generateMotivationalMessage - A function that generates a motivational message.
 * - MotivationalMessageInput - The input type for the generateMotivationalMessage function.
 * - MotivationalMessageOutput - The return type for the generateMotivationalMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MotivationalMessageInputSchema = z.object({
  element: z
    .enum(['air', 'water', 'earth', 'fire'])
    .describe('The elemental affinity of the user.'),
  progressPercentage: z
    .number()
    .min(0)
    .max(100)
    .describe('The progress percentage of the user towards their goals.'),
});
export type MotivationalMessageInput = z.infer<typeof MotivationalMessageInputSchema>;

const MotivationalMessageOutputSchema = z.object({
  message: z.string().describe('The dynamically generated motivational message.'),
});
export type MotivationalMessageOutput = z.infer<typeof MotivationalMessageOutputSchema>;

export async function generateMotivationalMessage(
  input: MotivationalMessageInput
): Promise<MotivationalMessageOutput> {
  return motivationalMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'motivationalMessagePrompt',
  input: {schema: MotivationalMessageInputSchema},
  output: {schema: MotivationalMessageOutputSchema},
  prompt: `You are a motivational bot that provides encouragement to users based on their elemental affinity and progress.

  Element: {{{element}}}
  Progress: {{{progressPercentage}}}%

  Generate a motivational message tailored to the user's element and progress. The message should be no more than 2 sentences.

  Example messages:
  - Air (25%): "The winds of change are with you. Keep soaring towards your goals!"
  - Water (50%): "Like water, adapt and flow. You're halfway there, keep going!"
  - Earth (75%): "Stay grounded and keep building. You're almost at the finish line!"
  - Fire (100%): "Your inner fire burns bright! You've achieved your goal!"
  `,
});

const motivationalMessageFlow = ai.defineFlow(
  {
    name: 'motivationalMessageFlow',
    inputSchema: MotivationalMessageInputSchema,
    outputSchema: MotivationalMessageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
