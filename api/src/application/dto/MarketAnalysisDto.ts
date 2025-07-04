import { z } from 'zod';

// Input schema for market analysis
export const MarketAnalysisInputSchema = z.object({
  targetCompanyName: z.string().min(1, 'Target company name is required'),
});

// Output schemas
export const AnalysisResultSchema = z.object({
  topicTitle: z.string(),
  analysisContent: z.string(),
});

export const RelationResultSchema = z.object({
  similarCompanyName: z.string(),
  specificAnalysisResultBetweenTargetCompany: z.string(),
  recommendationNextActionBetweenTargetCompany: z.string(),
});

export const MarketAnalysisOutputSchema = z.object({
  analysisResults: z.array(AnalysisResultSchema),
  relationResults: z.array(RelationResultSchema),
});

// Type exports
export type MarketAnalysisInput = z.infer<typeof MarketAnalysisInputSchema>;
export type MarketAnalysisOutput = z.infer<typeof MarketAnalysisOutputSchema>;