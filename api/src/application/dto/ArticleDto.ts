import { z } from 'zod';

export const GenerateCompetitorArticleInputSchema = z.object({
  companyKeyword: z.string().min(1, 'Company keyword is required'),
  options: z.object({
    language: z.enum(['EN', 'JP']).default('JP'),
    mode: z.enum(['normal', 'deep']).default('normal'),
    limit: z.number().int().min(1).max(50).default(10),
    includeEnvironmentAnalysis: z.boolean().default(true),
    includeThreatAnalysis: z.boolean().default(true),
    articleStyle: z.enum(['professional', 'casual', 'academic']).default('professional'),
    includeImages: z.boolean().default(false),
  }).optional().default({}),
});

export const GenerateCompetitorArticleOutputSchema = z.object({
  article: z.string(),
  metadata: z.object({
    title: z.string(),
    generatedAt: z.date(),
    companyName: z.string(),
    competitorCount: z.number(),
    wordCount: z.number(),
    includesEnvironmentAnalysis: z.boolean(),
    includesThreatAnalysis: z.boolean(),
  }),
});

export type GenerateCompetitorArticleInput = z.infer<typeof GenerateCompetitorArticleInputSchema>;
export type GenerateCompetitorArticleOutput = z.infer<typeof GenerateCompetitorArticleOutputSchema>;