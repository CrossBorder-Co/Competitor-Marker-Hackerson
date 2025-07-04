import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { ResearchCompetitorsInputSchema, ResearchCompetitorsOutputSchema } from '../../application/dto/ResearchDto.js';
import { ResearchCompetitorsUseCase } from '../../application/usecases/ResearchCompetitorsUseCase.js';

const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;

export interface Context {
  researchCompetitorsUseCase: ResearchCompetitorsUseCase;
}

export const appRouter = t.router({
  researchCompetitors: publicProcedure
    .input(ResearchCompetitorsInputSchema)
    .output(ResearchCompetitorsOutputSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.researchCompetitorsUseCase.execute(input.companyId, input.options);
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