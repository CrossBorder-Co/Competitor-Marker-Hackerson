import type { IMarketAnalysisService } from '../../domain/interfaces/IMarketAnalysisService.js';
import type { MarketAnalysisRequest, MarketAnalysisResponse } from '../../domain/models/MarketAnalysis.js';
import { TokenManager } from '../utils/TokenManager.js';
import OpenAI from 'openai';

export class OpenAIMarketAnalysisService implements IMarketAnalysisService {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey,
    });
  }

  async analyzeMarketEnvironment(request: MarketAnalysisRequest): Promise<MarketAnalysisResponse> {
    const systemPrompt = `
あなたは競合分析アシスタントです。指定された目標企業と、その類似企業群から構成される市場領域について、データサイエンス的観点も交えて市場状況を多角的・構造的に分析してください。
■ 入力内容：
・target_company_name（企業名）
・target_company_terms
・similar_companies_terms
・search_results（Web検索結果）- 利用可能な場合は、これらの最新情報を分析に活用してください
■ analysis_results の出力について
analysis_results では、市場全体や業界構造に関する主要な論点・トピックごとに、現状・課題・機会・トレンド等を**多面的かつ実務的に分析**してください。
トピック例：市場規模の推移、成長性、競争環境、顧客セグメント、主要技術トレンド、規制・障壁、新規参入リスクなど。
各トピックごとに、「topic_title」（分析テーマ）と「analysis_content」（要点を端的かつ具体的にまとめた内容）を記載してください。
■ relation_results の出力について
relation_results では、target_company（目標企業）と各 similar_company（類似企業）との**直接的な関係性**や**比較分析**を行い、下記３点を記載してください。
"similar_company_name": 類似企業名（必須）
"specific_analysis_result_between_target_company": 目標企業と当該類似企業との主な違い、共通点、競争優位性や脅威、協業可能性など**直接的な関係や相違点に関する定量・定性分析**を記載してください（例：技術力の差異、プロダクト展開範囲、顧客層、価格戦略の違い等）。
"recommendation_next_action_between_target_company": この分析をもとに、目標企業が当該類似企業に対して取るべき**推奨アクション**（例：プロダクト差別化、協業提案、競争優位強化策、新規市場開拓等）を具体的かつ実行可能なレベルで記載してください。
■ 出力フォーマット（JSON）:
{
  "analysis_results": [
    {"topic_title": "〇〇", "analysis_content": "〇〇"}
  ],
  "relation_results": [
    {
      "similar_company_name": "",
      "specific_analysis_result_between_target_company": "",
      "recommendation_next_action_between_target_company": ""
    }
  ]
}
JSON形式の結果のみを返し、不要な文章や解説は含めないでください。
`;

    return this.callOpenAI(systemPrompt, request);
  }

  async analyzeThreatEnvironment(request: MarketAnalysisRequest): Promise<MarketAnalysisResponse> {
    const systemPrompt = `
あなたは競合分析アシスタントです。指定された目標企業と、その類似企業群から構成される市場領域について、脅威分析に重点を置いて市場状況を多角的・構造的に分析してください。
■ 入力内容：
・target_company_name（企業名）
・target_company_terms
・similar_companies_terms
・search_results（Web検索結果）- 利用可能な場合は、これらの最新情報を分析に活用してください
■ analysis_results の出力について
analysis_results では、市場全体や業界構造に関する主要な論点・トピックごとに、現状・課題・機会・トレンド等を**多面的かつ実務的に分析**してください。
トピック例：市場規模の推移、成長性、競争環境、顧客セグメント、主要技術トレンド、規制・障壁、新規参入リスクなど。
各トピックごとに、「topic_title」（分析テーマ）と「analysis_content」（要点を端的かつ具体的にまとめた内容）を記載してください。
■ relation_results の出力について
relation_results では、target_company（目標企業）と各 similar_company（類似企業）との**直接的な関係性**や**比較分析**を行い、下記３点を記載してください。
"similar_company_name": 類似企業名（必須）
"specific_analysis_result_between_target_company": 目標企業と当該類似企業との主な違い、共通点、競争優位性や脅威、協業可能性など**直接的な関係や相違点に関する定量・定性分析**を記載してください（例：技術力の差異、プロダクト展開範囲、顧客層、価格戦略の違い等）。
"recommendation_next_action_between_target_company": この分析をもとに、目標企業が当該類似企業に対して取るべき**推奨アクション**（例：プロダクト差別化、協業提案、競争優位強化策、新規市場開拓等）を具体的かつ実行可能なレベルで記載してください。
■ 出力フォーマット（JSON）:
{
  "analysis_results": [
    {"topic_title": "〇〇", "analysis_content": "〇〇"}
  ],
  "relation_results": [
    {
      "similar_company_name": "",
      "specific_analysis_result_between_target_company": "",
      "recommendation_next_action_between_target_company": ""
    }
  ]
}
JSON形式の結果のみを返し、不要な文章や解説は含めないでください。
`;

    return this.callOpenAI(systemPrompt, request);
  }

  private async callOpenAI(systemPrompt: string, request: MarketAnalysisRequest): Promise<MarketAnalysisResponse> {
    let content = `target_company_name: ${request.targetCompanyName}, target_company_terms: ${JSON.stringify(request.targetCompanyTerms)}, similar_companies_terms: ${JSON.stringify(request.similarCompaniesTerms)}`;
    
    // Add search results if available
    if (request.searchResults && request.searchResults.length > 0) {
      const searchResultsText = request.searchResults.map(result => 
        `Query: ${result.query}\nResults: ${result.results.map(r => `${r.title}: ${r.snippet}`).join('\n')}`
      ).join('\n\n');
      content += `\n\nsearch_results:\n${searchResultsText}`;
    }

    // Optimize content for token limits
    const model = 'gpt-4o-mini';
    const optimizedContent = TokenManager.optimizeForAnalysis(systemPrompt, content, model);
    
    console.log(`🤖 Calling OpenAI for market analysis (${content.length} chars → ${optimizedContent.length} chars)...`);
    
    try {
      const response = await this.openai.chat.completions.create({
        model,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: optimizedContent,
          },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      });

      console.log(`✅ OpenAI market analysis response received`);
      console.log(`📊 Usage: ${response.usage?.prompt_tokens} prompt + ${response.usage?.completion_tokens} completion = ${response.usage?.total_tokens} total tokens`);

      const analysisResult = response.choices[0]?.message?.content;
      if (!analysisResult) {
        throw new Error('No analysis result generated');
      }

      const parsedResult = JSON.parse(analysisResult);
      
      return {
        analysisResults: parsedResult.analysis_results?.map((item: any) => ({
          topicTitle: item.topic_title,
          analysisContent: item.analysis_content,
        })) || [],
        relationResults: parsedResult.relation_results?.map((item: any) => ({
          similarCompanyName: item.similar_company_name,
          specificAnalysisResultBetweenTargetCompany: item.specific_analysis_result_between_target_company,
          recommendationNextActionBetweenTargetCompany: item.recommendation_next_action_between_target_company,
        })) || [],
      };
    } catch (error) {
      console.error(`❌ Market analysis error:`, error);
      throw new Error(`Market analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}