import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { ResearchCompetitorsInputSchema, ResearchCompetitorsOutputSchema } from '../../application/dto/ResearchDto.js';
import { GenerateCompetitorArticleInputSchema, GenerateCompetitorArticleOutputSchema } from '../../application/dto/ArticleDto.js';
import type { Context } from './context.js';
import { McpConversationInputSchema, McpConversationOutputSchema } from '../../application/dto/McpDto.js';
import { GraphCompanyRevenuesInputSchema, GraphCompanyRevenuesOutputSchema } from '../../application/dto/GraphCompanyRevenues.js';

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const appRouter = t.router({
  researchCompetitors: publicProcedure
    .input(ResearchCompetitorsInputSchema)
    .output(ResearchCompetitorsOutputSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.researchCompetitorsUseCase.execute(input.companyKeyword, input.options);
    }),

  generateCompetitorArticle: publicProcedure
    .input(GenerateCompetitorArticleInputSchema)
    .output(GenerateCompetitorArticleOutputSchema)
    .mutation(async ({ input, ctx }) => {
      const researchOptions = {
        language: input.options.language,
        mode: input.options.mode,
        limit: input.options.limit,
        includeEnvironmentAnalysis: input.options.includeEnvironmentAnalysis,
        includeThreatAnalysis: input.options.includeThreatAnalysis,
      };

      const articleOptions = {
        articleStyle: input.options.articleStyle,
        includeImages: input.options.includeImages,
        language: input.options.language,
      };

      return await ctx.articleGenerationUseCase.execute(
        input.companyKeyword,
        researchOptions,
        articleOptions
      );
    }),
  
  mcpConversation: publicProcedure
    .input(McpConversationInputSchema)
    .output(McpConversationOutputSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.mcpConversationUseCase.execute(input);
    }),
  
  graphCompanyRevenuesUseCase: publicProcedure
    .input(GraphCompanyRevenuesInputSchema)
    .output(GraphCompanyRevenuesOutputSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.graphCompanyRevenuesUseCase.execute(input);
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