import type { IAnalysisService } from '../../domain/interfaces/IAnalysisService.js';
import type { SearchResult, CompetitorResearch, ResearchOptions } from '../../domain/models/Company.js';
import OpenAI from 'openai';

export class OpenAIAnalysisService implements IAnalysisService {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey,
    });
  }

  async analyzeCompetitor(
    competitorName: string,
    searchResults: SearchResult[],
    targetCompanyContext: string,
    options: ResearchOptions
  ): Promise<CompetitorResearch> {
    console.log(`      🤖 Building analysis prompt for ${competitorName}`);
    const prompt = this.buildAnalysisPrompt(competitorName, searchResults, targetCompanyContext, options);
    
    const totalSearchContent = searchResults.reduce((sum, r) => 
      sum + r.results.reduce((s, item) => s + (item.snippet?.length || 0) + (item.content?.length || 0), 0), 0
    );
    console.log(`      📝 Prompt prepared (${prompt.length} chars, ${totalSearchContent} chars of search content)`);
    
    try {
      console.log(`      🧠 Calling OpenAI GPT-4 for analysis...`);
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: options.language === 'JP' 
              ? 'あなたは競合他社分析の専門家です。日本語で詳細な分析を行ってください。'
              : 'You are a competitive analysis expert. Provide detailed analysis in English.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
      });

      console.log(`      ✅ OpenAI response received`);
      console.log(`      📊 Usage: ${response.usage?.prompt_tokens} prompt + ${response.usage?.completion_tokens} completion = ${response.usage?.total_tokens} total tokens`);

      const analysis = response.choices[0]?.message?.content;
      if (!analysis) {
        throw new Error('No analysis generated');
      }

      console.log(`      📋 Parsing analysis (${analysis.length} characters)`);
      const parsedResult = this.parseAnalysis(analysis, competitorName);
      console.log(`      ✅ Analysis parsed successfully`);

      return parsedResult;
    } catch (error) {
      console.error(`      ❌ Analysis error for ${competitorName}:`, error);
      throw new Error(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private buildAnalysisPrompt(
    competitorName: string,
    searchResults: SearchResult[],
    targetCompanyContext: string,
    options: ResearchOptions
  ): string {
    const searchContent = searchResults
      .map(result => 
        result.results
          .map(item => `タイトル: ${item.title}\nURL: ${item.url}\n内容: ${item.snippet}`)
          .join('\n\n')
      )
      .join('\n\n---\n\n');

    if (options.language === 'JP') {
      return `
以下の情報を基に、競合他社「${competitorName}」の詳細な分析を行ってください。

対象会社の情報:
${targetCompanyContext}

競合他社の検索結果:
${searchContent}

以下の形式で分析結果を返してください:

**主要製品・サービス:**
- [製品1]
- [製品2]
- [製品3]

**主要機能・特徴:**
- [機能1]
- [機能2]
- [機能3]

**強み:**
- [強み1]
- [強み2]
- [強み3]

**弱み:**
- [弱み1]
- [弱み2]
- [弱み3]

**市場ポジション:**
[市場での位置づけについて]

**対象会社との比較:**
[具体的な比較分析]
`;
    } else {
      return `
Based on the following information, provide a detailed analysis of competitor "${competitorName}".

Target company information:
${targetCompanyContext}

Competitor search results:
${searchContent}

Please return the analysis in the following format:

**Main Products/Services:**
- [Product 1]
- [Product 2]
- [Product 3]

**Key Features:**
- [Feature 1]
- [Feature 2]
- [Feature 3]

**Strengths:**
- [Strength 1]
- [Strength 2]
- [Strength 3]

**Weaknesses:**
- [Weakness 1]
- [Weakness 2]
- [Weakness 3]

**Market Position:**
[Market positioning analysis]

**Comparison with Target Company:**
[Specific comparative analysis]
`;
    }
  }

  private parseAnalysis(analysis: string, competitorName: string): CompetitorResearch {
    const sections = this.extractSections(analysis);
    
    return {
      companyId: '', // Will be set by the calling service
      competitorName,
      mainProducts: this.extractList(sections.products || ''),
      keyFeatures: this.extractList(sections.features || ''),
      strengths: this.extractList(sections.strengths || ''),
      weaknesses: this.extractList(sections.weaknesses || ''),
      marketPosition: sections.marketPosition || '',
      comparisonNotes: sections.comparison || '',
      lastUpdated: new Date(),
    };
  }

  private extractSections(analysis: string): Record<string, string> {
    const sections: Record<string, string> = {};
    
    // Extract main products
    const productsMatch = analysis.match(/\*\*主要製品・サービス:\*\*\n([\s\S]*?)(?=\n\*\*|$)/i) ||
                         analysis.match(/\*\*Main Products\/Services:\*\*\n([\s\S]*?)(?=\n\*\*|$)/i);
    if (productsMatch) sections.products = productsMatch[1].trim();

    // Extract key features
    const featuresMatch = analysis.match(/\*\*主要機能・特徴:\*\*\n([\s\S]*?)(?=\n\*\*|$)/i) ||
                         analysis.match(/\*\*Key Features:\*\*\n([\s\S]*?)(?=\n\*\*|$)/i);
    if (featuresMatch) sections.features = featuresMatch[1].trim();

    // Extract strengths
    const strengthsMatch = analysis.match(/\*\*強み:\*\*\n([\s\S]*?)(?=\n\*\*|$)/i) ||
                          analysis.match(/\*\*Strengths:\*\*\n([\s\S]*?)(?=\n\*\*|$)/i);
    if (strengthsMatch) sections.strengths = strengthsMatch[1].trim();

    // Extract weaknesses
    const weaknessesMatch = analysis.match(/\*\*弱み:\*\*\n([\s\S]*?)(?=\n\*\*|$)/i) ||
                           analysis.match(/\*\*Weaknesses:\*\*\n([\s\S]*?)(?=\n\*\*|$)/i);
    if (weaknessesMatch) sections.weaknesses = weaknessesMatch[1].trim();

    // Extract market position
    const marketMatch = analysis.match(/\*\*市場ポジション:\*\*\n([\s\S]*?)(?=\n\*\*|$)/i) ||
                       analysis.match(/\*\*Market Position:\*\*\n([\s\S]*?)(?=\n\*\*|$)/i);
    if (marketMatch) sections.marketPosition = marketMatch[1].trim();

    // Extract comparison
    const comparisonMatch = analysis.match(/\*\*対象会社との比較:\*\*\n([\s\S]*?)(?=\n\*\*|$)/i) ||
                           analysis.match(/\*\*Comparison with Target Company:\*\*\n([\s\S]*?)(?=\n\*\*|$)/i);
    if (comparisonMatch) sections.comparison = comparisonMatch[1].trim();

    return sections;
  }

  private extractList(text: string): string[] {
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('- '))
      .map(line => line.substring(2).trim())
      .filter(line => line.length > 0);
  }
}