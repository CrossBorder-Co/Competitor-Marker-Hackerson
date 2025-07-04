import { z } from 'zod';

export const GraphCompanyRevenuesInputSchema = z.object({
  companyId: z.string().min(1, 'Query is required'),
});

export const GraphCompanyRevenuesOutputSchema = z.record(z.string());

export type GraphCompanyRevenuesInput = z.infer<typeof GraphCompanyRevenuesInputSchema>;
export type GraphCompanyRevenuesOutput = z.infer<typeof GraphCompanyRevenuesOutputSchema>;