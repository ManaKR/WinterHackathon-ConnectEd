'use server';
/**
 * @fileOverview This file defines a Genkit flow for recommending events to students based on their interests and past activity.
 *
 * The flow takes a student's profile (interests, past activity) and a list of upcoming events as input.
 * It uses a language model to generate personalized event recommendations for the student.
 *
 * @exported recommendEvents - The main function to trigger the event recommendation flow.
 * @exported RecommendEventsInput - The input type for the recommendEvents function.
 * @exported RecommendEventsOutput - The output type for the recommendEvents function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the schema for a single event
const EventSchema = z.object({
  name: z.string().describe('The name of the event'),
  description: z.string().describe('A detailed description of the event'),
  category: z.string().describe('The category of the event (e.g., sports, academic, social)'),
  dateTime: z.string().describe('The date and time of the event in ISO format'),
  location: z.string().describe('The location of the event'),
});

// Define the input schema for the recommendEvents function
const RecommendEventsInputSchema = z.object({
  studentProfile: z.object({
    interests: z.array(z.string()).describe('List of student interests (e.g., AI, music, sports)'),
    pastActivity: z.array(z.string()).describe('List of events the student has attended in the past'),
  }).describe('The student profile including interests and past activities'),
  upcomingEvents: z.array(EventSchema).describe('List of upcoming events'),
});
export type RecommendEventsInput = z.infer<typeof RecommendEventsInputSchema>;

// Define the output schema for the recommendEvents function
const RecommendEventsOutputSchema = z.object({
  recommendedEvents: z.array(EventSchema).describe('List of events recommended for the student'),
  reasoning: z.string().describe('Explanation of why these events were recommended'),
});
export type RecommendEventsOutput = z.infer<typeof RecommendEventsOutputSchema>;

// Exported function to call the flow
export async function recommendEvents(input: RecommendEventsInput): Promise<RecommendEventsOutput> {
  return recommendEventsFlow(input);
}

// Define the prompt for recommending events
const recommendEventsPrompt = ai.definePrompt({
  name: 'recommendEventsPrompt',
  input: {schema: RecommendEventsInputSchema},
  output: {schema: RecommendEventsOutputSchema},
  prompt: `You are an AI event recommendation system.

You will receive a student profile containing their interests and past activities, and a list of upcoming events.
Based on this information, you will recommend events that the student might be interested in.

Student Profile:
Interests: {{studentProfile.interests}}
Past Activities: {{studentProfile.pastActivity}}

Upcoming Events:
{{#each upcomingEvents}}
  - Name: {{this.name}}
    Description: {{this.description}}
    Category: {{this.category}}
    Date/Time: {{this.dateTime}}
    Location: {{this.location}}
{{/each}}

Consider the student's interests, past activities, and the details of each upcoming event to determine the best recommendations.
Explain your reasoning for the recommendations in the reasoning field.

Output the recommended events.
`,
});

// Define the Genkit flow for recommending events
const recommendEventsFlow = ai.defineFlow(
  {
    name: 'recommendEventsFlow',
    inputSchema: RecommendEventsInputSchema,
    outputSchema: RecommendEventsOutputSchema,
  },
  async input => {
    const {output} = await recommendEventsPrompt(input);
    return output!;
  }
);
