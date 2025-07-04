import type { ICompanyRepository } from '../../domain/interfaces/ICompanyRepository.js';
import type { GraphCompanyRevenuesInput, GraphCompanyRevenuesOutput } from '../dto/GraphCompanyRevenues.js';

export class GraphCompanyRevenuesUseCase {
  constructor(
      private companyRepository: ICompanyRepository,
    ) {}

  async execute(input: GraphCompanyRevenuesInput): Promise<GraphCompanyRevenuesOutput> {
    console.log(`🎯 Executing GraphCompanyRevenues use case: "${input.companyId}"`);
    
    if (!input.companyId || input.companyId.trim().length === 0) {
      throw new Error('companyId is required and cannot be empty');
    }
    
    try {
        const competitors = (await this.companyRepository.findById(input.companyId))?.recommendationKeywords || [];
        const ranges = await this.companyRepository.getAllRevenueRanges();
        let filteredRanges: Record<string, string> = {};
        competitors.forEach(o => {
            if (ranges[o]) filteredRanges[o] = ranges[o];
        });

        return filteredRanges;
    } catch (error) {
      console.error('❌ GraphCompanyRevenues use case failed:', error);
      throw new Error(`Failed to execute GraphCompanyRevenues: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
