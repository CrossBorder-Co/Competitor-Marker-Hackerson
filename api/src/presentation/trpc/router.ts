import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { ResearchCompetitorsInputSchema, ResearchCompetitorsOutputSchema } from '../../application/dto/ResearchDto.js';
import { MarketAnalysisInputSchema, MarketAnalysisOutputSchema } from '../../application/dto/MarketAnalysisDto.js';
import type { Context } from './context.js';
import { McpConversationInputSchema, McpConversationOutputSchema } from '../../application/dto/McpDto.js';

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const appRouter = t.router({
  researchCompetitors: publicProcedure
    .input(ResearchCompetitorsInputSchema)
    .output(ResearchCompetitorsOutputSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.researchCompetitorsUseCase.execute(input.companyId, input.options);
    }),

  analyzeEnvironment: publicProcedure
    .input(MarketAnalysisInputSchema)
    .output(MarketAnalysisOutputSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.marketAnalysisUseCase.analyzeEnvironment(input.targetCompanyName);
    }),

  analyzeThreat: publicProcedure
    .input(MarketAnalysisInputSchema)
    .output(MarketAnalysisOutputSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.marketAnalysisUseCase.analyzeThreat(input.targetCompanyName);
    }),
  
  mcpConversation: publicProcedure
    .input(McpConversationInputSchema)
    .output(McpConversationOutputSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.mcpConversationUseCase.execute(input);
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