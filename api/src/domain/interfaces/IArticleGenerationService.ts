import type { ResearchCompetitorsResponse } from '../../application/usecases/ResearchCompetitorsUseCase.js';

export interface ArticleGenerationOptions {
  articleStyle: 'professional' | 'casual' | 'academic';
  includeImages: boolean;
  language: 'EN' | 'JP';
}

export interface GeneratedArticle {
  content: string;
  title: string;
  wordCount: number;
}

export interface IArticleGenerationService {
  generateCompetitorArticle(
    companyName: string,
    researchData: ResearchCompetitorsResponse,
    options: ArticleGenerationOptions
  ): Promise<GeneratedArticle>;
}