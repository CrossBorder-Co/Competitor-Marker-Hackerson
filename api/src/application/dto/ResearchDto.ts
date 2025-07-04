import { z } from 'zod';

export const ResearchOptionsSchema = z.object({
  language: z.enum(['EN', 'JP']).default('JP'),
  mode: z.enum(['normal', 'deep']).default('normal'),
  limit: z.number().int().min(1).max(50).default(10),
});

export const ResearchCompetitorsInputSchema = z.object({
  companyId: z.string().min(1, 'Company ID is required'),
  options: ResearchOptionsSchema.optional().default({}),
});

export const CompetitorResearchSchema = z.object({
  companyId: z.string(),
  competitorName: z.string(),
  mainProducts: z.array(z.string()),
  keyFeatures: z.array(z.string()),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  marketPosition: z.string(),
  comparisonNotes: z.string(),
  websiteUrl: z.string().optional(),
  lastUpdated: z.date(),
});

export const ResearchCompetitorsOutputSchema = z.array(CompetitorResearchSchema);

export type ResearchOptionsDto = z.infer<typeof ResearchOptionsSchema>;
export type ResearchCompetitorsInputDto = z.infer<typeof ResearchCompetitorsInputSchema>;
export type CompetitorResearchDto = z.infer<typeof CompetitorResearchSchema>;
export type ResearchCompetitorsOutputDto = z.infer<typeof ResearchCompetitorsOutputSchema>;