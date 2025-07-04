import { z } from 'zod';

export const McpConversationInputSchema = z.object({
  query: z.string().min(1, 'Query is required'),
});

export const McpConversationOutputSchema = z.object({
  response: z.string(),
});

export type McpConversationInput = z.infer<typeof McpConversationInputSchema>;
export type McpConversationOutput = z.infer<typeof McpConversationOutputSchema>;