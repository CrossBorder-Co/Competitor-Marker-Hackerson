import { z } from 'zod';

export const McpConversationInputSchema = z.object({
  query: z.string().min(1, 'Query is required'),
  subIds: z.array(z.number()).optional().default([1, 66]),
});

export const McpConversationOutputSchema = z.object({
  response: z.string(),
  mcpData: z.string(),
  timestamp: z.date(),
});

export type McpConversationInput = z.infer<typeof McpConversationInputSchema>;
export type McpConversationOutput = z.infer<typeof McpConversationOutputSchema>;