import type { IArticleGenerationService, ArticleGenerationOptions, GeneratedArticle } from '../../domain/interfaces/IArticleGenerationService.js';
import type { ResearchCompetitorsResponse } from '../../application/usecases/ResearchCompetitorsUseCase.js';
import OpenAI from 'openai';

export class OpenAIArticleGenerationService implements IArticleGenerationService {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey,
    });
  }

  async generateCompetitorArticle(
    companyName: string,
    researchData: ResearchCompetitorsResponse,
    options: ArticleGenerationOptions
  ): Promise<GeneratedArticle> {
    console.log(`📝 Generating competitor article for ${companyName}...`);

    const systemPrompt = this.buildSystemPrompt(options);
    const userContent = this.buildUserContent(companyName, researchData);

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userContent,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      });

      console.log(`✅ Article generation completed`);
      console.log(`📊 Usage: ${response.usage?.prompt_tokens} prompt + ${response.usage?.completion_tokens} completion = ${response.usage?.total_tokens} total tokens`);

      const articleContent = response.choices[0]?.message?.content;
      if (!articleContent) {
        throw new Error('No article content generated');
      }

      // Extract title from the markdown content
      const titleMatch = articleContent.match(/^#\s+(.+)/m);
      const title = titleMatch ? titleMatch[1] : `${companyName} 競合分析レポート`;

      // Count words (approximate for both English and Japanese)
      const wordCount = this.countWords(articleContent);

      return {
        content: articleContent,
        title,
        wordCount,
      };
    } catch (error) {
      console.error(`❌ Article generation error:`, error);
      throw new Error(`Article generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private buildSystemPrompt(options: ArticleGenerationOptions): string {
    const styleInstructions = {
      professional: '専門的でビジネス向けの文体で、データと分析に基づいた客観的な内容',
      casual: 'わかりやすく親しみやすい文体で、読みやすく実用的な内容',
      academic: '学術的で詳細な分析を含む、研究論文のような体系的な内容'
    };

    const languageInstructions = options.language === 'JP' 
      ? 'すべて日本語で記述してください。'
      : 'Write everything in English.';

    return `
あなたは競合分析の専門家です。提供された競合調査データを基に、${styleInstructions[options.articleStyle]}の記事を作成してください。

記事の要件：
- Markdown形式で出力
- ${languageInstructions}
- 適切な見出し構造（H1, H2, H3）を使用
- 競合他社の分析結果を整理して記述
- 市場環境分析と脅威分析が含まれている場合は、それらも含める
- 具体的な競合企業の特徴、強み、弱み、市場ポジションを明記
- 読み手にとって有用な洞察と推奨アクションを含める
- 表やリストを適切に使用して読みやすくする

${options.includeImages ? '- 画像のプレースホルダー（![image description](placeholder)）を適切な場所に配置' : ''}

記事構成の例：
1. エグゼクティブサマリー
2. 企業概要
3. 競合分析
4. 市場環境分析（提供されている場合）
5. 脅威分析（提供されている場合）
6. 推奨アクション
7. まとめ
`;
  }

  private buildUserContent(companyName: string, researchData: ResearchCompetitorsResponse): string {
    let content = `対象企業: ${companyName}\n\n`;

    // Competitor research data
    content += '=== 競合調査データ ===\n';
    if (researchData.competitorResearch.length > 0) {
      researchData.competitorResearch.forEach((competitor, index) => {
        content += `\n競合企業 ${index + 1}: ${competitor.competitorName}\n`;
        content += `主要製品・サービス: ${competitor.mainProducts.join(', ')}\n`;
        content += `主要機能: ${competitor.keyFeatures.join(', ')}\n`;
        content += `強み: ${competitor.strengths.join(', ')}\n`;
        content += `弱み: ${competitor.weaknesses.join(', ')}\n`;
        content += `市場ポジション: ${competitor.marketPosition}\n`;
        content += `比較分析: ${competitor.comparisonNotes}\n`;
        if (competitor.websiteUrl) {
          content += `ウェブサイト: ${competitor.websiteUrl}\n`;
        }
      });
    } else {
      content += '競合調査データが利用できません。\n';
    }

    // Environment analysis
    if (researchData.environmentAnalysis) {
      content += '\n=== 市場環境分析 ===\n';
      researchData.environmentAnalysis.analysisResults.forEach((result, index) => {
        content += `\n分析項目 ${index + 1}: ${result.topicTitle}\n`;
        content += `内容: ${result.analysisContent}\n`;
      });

      content += '\n--- 関係性分析 ---\n';
      researchData.environmentAnalysis.relationResults.forEach((result, index) => {
        content += `\n類似企業 ${index + 1}: ${result.similarCompanyName}\n`;
        content += `分析: ${result.specificAnalysisResultBetweenTargetCompany}\n`;
        content += `推奨アクション: ${result.recommendationNextActionBetweenTargetCompany}\n`;
      });
    }

    // Threat analysis
    if (researchData.threatAnalysis) {
      content += '\n=== 脅威分析 ===\n';
      researchData.threatAnalysis.analysisResults.forEach((result, index) => {
        content += `\n脅威項目 ${index + 1}: ${result.topicTitle}\n`;
        content += `内容: ${result.analysisContent}\n`;
      });

      content += '\n--- 脅威関係性分析 ---\n';
      researchData.threatAnalysis.relationResults.forEach((result, index) => {
        content += `\n脅威企業 ${index + 1}: ${result.similarCompanyName}\n`;
        content += `分析: ${result.specificAnalysisResultBetweenTargetCompany}\n`;
        content += `対策推奨: ${result.recommendationNextActionBetweenTargetCompany}\n`;
      });
    }

    return content;
  }

  private countWords(text: string): number {
    // Remove markdown syntax for more accurate count
    const cleanText = text
      .replace(/#{1,6}\s+/g, '') // Remove headers
      .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1') // Remove bold/italic
      .replace(/`([^`]+)`/g, '$1') // Remove inline code
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // Remove images
      .replace(/\|[^|\n]*\|/g, '') // Remove table rows
      .replace(/[-*+]\s+/g, '') // Remove list markers
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .trim();

    // Count words (handles both English and Japanese)
    const words = cleanText.split(/\s+/).filter(word => word.length > 0);
    
    // For Japanese text, also count characters as approximate words
    const japaneseChars = cleanText.match(/[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/g);
    const japaneseWordEstimate = japaneseChars ? Math.ceil(japaneseChars.length / 2) : 0;

    // Return the higher of the two counts
    return Math.max(words.length, japaneseWordEstimate);
  }
}