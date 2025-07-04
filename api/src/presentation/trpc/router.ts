import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { ResearchCompetitorsInputSchema, ResearchCompetitorsOutputSchema, McpConversationInputSchema, McpConversationOutputSchema } from '../../application/dto/ResearchDto.js';
import type { Context } from './context.js';

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;


export const appRouter = t.router({
  researchCompetitors: publicProcedure
    .input(ResearchCompetitorsInputSchema)
    .output(ResearchCompetitorsOutputSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.container.getResearchCompetitorsUseCase().execute(input.companyId, input.options);
    }),
  
  mcpConversation: publicProcedure
    .input(McpConversationInputSchema)
    .output(McpConversationOutputSchema)
    .mutation(async ({ input, ctx }) => {
      console.log('💬 MCP conversation endpoint called:', {
        query: input.query,
        subIds: input.subIds,
      });

      try {
        const result = await ctx.container.getMcpConversationUseCase().execute(input);
        console.log('✅ MCP conversation completed successfully');
        return result;
      } catch (error) {
        console.error('❌ MCP conversation failed:', error);
        throw new Error(`MCP conversation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),
  
  health: publicProcedure
    .input(z.void())
    .output(z.object({ status: z.string(), timestamp: z.date() }))
    .query(() => ({
      status: 'ok',
      timestamp: new Date(),
    })),
});

export type AppRouter = typeof appRouter;
