import type { IArticleGenerationService, ArticleGenerationOptions } from '../../domain/interfaces/IArticleGenerationService.js';
import type { ResearchCompetitorsUseCase } from './ResearchCompetitorsUseCase.js';
import type { ResearchOptions } from '../../domain/models/Company.js';

export interface ArticleGenerationResponse {
  article: string;
  metadata: {
    title: string;
    generatedAt: Date;
    companyName: string;
    competitorCount: number;
    wordCount: number;
    includesEnvironmentAnalysis: boolean;
    includesThreatAnalysis: boolean;
  };
}

export class ArticleGenerationUseCase {
  constructor(
    private researchCompetitorsUseCase: ResearchCompetitorsUseCase,
    private articleGenerationService: IArticleGenerationService
  ) {}

  async execute(
    companyKeyword: string,
    researchOptions: ResearchOptions,
    articleOptions: ArticleGenerationOptions
  ): Promise<ArticleGenerationResponse> {
    console.log(`📰 Starting article generation for company: ${companyKeyword}`);
    
    // 1. Get research data using ResearchCompetitorsUseCase
    console.log(`🔍 Gathering research data...`);
    const researchData = await this.researchCompetitorsUseCase.execute(companyKeyword, researchOptions);
    
    // Extract company name from research data or use keyword as fallback
    const companyName = researchData.competitorResearch.length > 0 
      ? this.extractCompanyNameFromResearch(companyKeyword, researchData)
      : companyKeyword;

    console.log(`📊 Research completed: ${researchData.competitorResearch.length} competitors found`);
    console.log(`🌍 Environment analysis included: ${!!researchData.environmentAnalysis}`);
    console.log(`⚠️ Threat analysis included: ${!!researchData.threatAnalysis}`);

    // 2. Generate article using the research data
    console.log(`📝 Generating article content...`);
    const generatedArticle = await this.articleGenerationService.generateCompetitorArticle(
      companyName,
      researchData,
      articleOptions
    );

    console.log(`✅ Article generation completed`);
    console.log(`📄 Title: ${generatedArticle.title}`);
    console.log(`📝 Word count: ${generatedArticle.wordCount}`);

    // 3. Build response with metadata
    const response: ArticleGenerationResponse = {
      article: generatedArticle.content,
      metadata: {
        title: generatedArticle.title,
        generatedAt: new Date(),
        companyName,
        competitorCount: researchData.competitorResearch.length,
        wordCount: generatedArticle.wordCount,
        includesEnvironmentAnalysis: !!researchData.environmentAnalysis,
        includesThreatAnalysis: !!researchData.threatAnalysis,
      },
    };

    console.log(`🎉 Article generation process completed successfully`);
    return response;
  }

  private extractCompanyNameFromResearch(keyword: string, researchData: any): string {
    // Try to extract company name from research context or use keyword
    // This is a simple implementation - could be enhanced based on actual data structure
    return keyword;
  }
}