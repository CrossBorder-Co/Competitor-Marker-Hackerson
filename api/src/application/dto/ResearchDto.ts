import { z } from 'zod';

export const ResearchOptionsSchema = z.object({
  language: z.enum(['EN', 'JP']).default('JP'),
  mode: z.enum(['normal', 'deep']).default('normal'),
  limit: z.number().int().min(1).max(50).default(10),
  includeEnvironmentAnalysis: z.boolean().default(false),
  includeThreatAnalysis: z.boolean().default(false),
});

export const ResearchCompetitorsInputSchema = z.object({
  companyKeyword: z.string().min(1, 'Company keyword is required'),
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

export const ResearchCompetitorsOutputSchema = z.object({
  competitorResearch: z.array(CompetitorResearchSchema),
  environmentAnalysis: z.object({
    analysisResults: z.array(z.object({
      topicTitle: z.string(),
      analysisContent: z.string(),
    })),
    relationResults: z.array(z.object({
      similarCompanyName: z.string(),
      specificAnalysisResultBetweenTargetCompany: z.string(),
      recommendationNextActionBetweenTargetCompany: z.string(),
    })),
  }).optional(),
  threatAnalysis: z.object({
    analysisResults: z.array(z.object({
      topicTitle: z.string(),
      analysisContent: z.string(),
    })),
    relationResults: z.array(z.object({
      similarCompanyName: z.string(),
      specificAnalysisResultBetweenTargetCompany: z.string(),
      recommendationNextActionBetweenTargetCompany: z.string(),
    })),
  }).optional(),
});

export type ResearchOptionsDto = z.infer<typeof ResearchOptionsSchema>;
export type ResearchCompetitorsInputDto = z.infer<typeof ResearchCompetitorsInputSchema>;
export type CompetitorResearchDto = z.infer<typeof CompetitorResearchSchema>;
export type ResearchCompetitorsOutputDto = z.infer<typeof ResearchCompetitorsOutputSchema>;