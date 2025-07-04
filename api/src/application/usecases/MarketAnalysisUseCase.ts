import type { ICompanyRepository } from '../../domain/interfaces/ICompanyRepository.js';
import type { IMarketAnalysisService } from '../../domain/interfaces/IMarketAnalysisService.js';
import type { MarketAnalysisResponse } from '../../domain/models/MarketAnalysis.js';

export class MarketAnalysisUseCase {
  constructor(
    private companyRepository: ICompanyRepository,
    private marketAnalysisService: IMarketAnalysisService
  ) {}

  async analyzeEnvironment(targetCompanyName: string): Promise<MarketAnalysisResponse> {
    console.log(`🔍 Starting market environment analysis for: ${targetCompanyName}`);
    
    // Find the target company in our repository
    const company = await this.companyRepository.findByName(targetCompanyName);
    if (!company) {
      throw new Error(`Company with name ${targetCompanyName} not found`);
    }

    // Get competitor companies and their keywords
    const competitors = await this.companyRepository.getCompetitors(company.id);
    
    const similarCompaniesTerms: Record<string, string[]> = {};
    for (const competitorName of competitors) {
      const competitorCompany = await this.companyRepository.findByName(competitorName);
      if (competitorCompany) {
        similarCompaniesTerms[competitorName] = competitorCompany.keywords;
      }
    }

    console.log(`📊 Found ${Object.keys(similarCompaniesTerms).length} competitor companies`);

    const request = {
      targetCompanyName: company.name,
      targetCompanyTerms: company.keywords,
      similarCompaniesTerms,
    };

    const result = await this.marketAnalysisService.analyzeMarketEnvironment(request);
    
    console.log(`✅ Market environment analysis completed`);
    console.log(`📋 Generated ${result.analysisResults.length} analysis topics and ${result.relationResults.length} relation results`);

    return result;
  }

  async analyzeThreat(targetCompanyName: string): Promise<MarketAnalysisResponse> {
    console.log(`🔍 Starting threat analysis for: ${targetCompanyName}`);
    
    // Find the target company in our repository
    const company = await this.companyRepository.findByName(targetCompanyName);
    if (!company) {
      throw new Error(`Company with name ${targetCompanyName} not found`);
    }

    // Get competitor companies and their keywords
    const competitors = await this.companyRepository.getCompetitors(company.id);
    
    const similarCompaniesTerms: Record<string, string[]> = {};
    for (const competitorName of competitors) {
      const competitorCompany = await this.companyRepository.findByName(competitorName);
      if (competitorCompany) {
        similarCompaniesTerms[competitorName] = competitorCompany.keywords;
      }
    }

    console.log(`📊 Found ${Object.keys(similarCompaniesTerms).length} competitor companies`);

    const request = {
      targetCompanyName: company.name,
      targetCompanyTerms: company.keywords,
      similarCompaniesTerms,
    };

    const result = await this.marketAnalysisService.analyzeThreatEnvironment(request);
    
    console.log(`✅ Threat analysis completed`);
    console.log(`📋 Generated ${result.analysisResults.length} analysis topics and ${result.relationResults.length} relation results`);

    return result;
  }
}