/**
 * Utility class for managing OpenAI token limits and content truncation
 */
export class TokenManager {
  // Approximate token limits for different models
  private static readonly MODEL_LIMITS = {
    'gpt-4o-mini': 8192,
    'gpt-4o': 128000,
    'gpt-4': 8192,
    'gpt-3.5-turbo': 4096,
  };

  // Reserve tokens for system prompt and response
  private static readonly RESERVED_TOKENS = 2000;

  /**
   * Estimate token count (rough approximation: 1 token ≈ 4 characters for English/Japanese mix)
   */
  static estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }

  /**
   * Get available tokens for user content given model and system prompt
   */
  static getAvailableTokens(model: string, systemPrompt: string): number {
    const modelLimit = this.MODEL_LIMITS[model as keyof typeof this.MODEL_LIMITS] || 8192;
    const systemTokens = this.estimateTokens(systemPrompt);
    return Math.max(0, modelLimit - systemTokens - this.RESERVED_TOKENS);
  }

  /**
   * Truncate text to fit within token limit
   */
  static truncateToTokenLimit(text: string, maxTokens: number): string {
    const estimatedTokens = this.estimateTokens(text);
    
    if (estimatedTokens <= maxTokens) {
      return text;
    }

    // Calculate how much to keep (with some buffer)
    const targetLength = Math.floor((maxTokens * 4) * 0.9); // 90% to be safe
    
    if (targetLength <= 100) {
      return text.substring(0, 100) + "...";
    }

    // Try to truncate at sentence or paragraph boundaries
    const truncated = text.substring(0, targetLength);
    
    // Find last sentence ending
    const lastSentence = Math.max(
      truncated.lastIndexOf('。'),
      truncated.lastIndexOf('.'),
      truncated.lastIndexOf('!'),
      truncated.lastIndexOf('?')
    );

    if (lastSentence > targetLength * 0.7) {
      return truncated.substring(0, lastSentence + 1) + "\n\n[内容が長すぎるため切り詰められました]";
    }

    // Fallback to word boundary
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > targetLength * 0.8) {
      return truncated.substring(0, lastSpace) + "...\n\n[内容が長すぎるため切り詰められました]";
    }

    return truncated + "...\n\n[内容が長すぎるため切り詰められました]";
  }

  /**
   * Summarize search results to fit within token limits
   */
  static summarizeSearchResults(searchResults: any[], maxTokens: number): string {
    let summary = '';
    let currentTokens = 0;

    for (const result of searchResults) {
      const resultSummary = this.summarizeSearchResult(result);
      const resultTokens = this.estimateTokens(resultSummary);

      if (currentTokens + resultTokens > maxTokens) {
        // Try to fit a truncated version
        const remainingTokens = maxTokens - currentTokens;
        if (remainingTokens > 100) {
          summary += this.truncateToTokenLimit(resultSummary, remainingTokens);
        }
        break;
      }

      summary += resultSummary + '\n\n';
      currentTokens += resultTokens;
    }

    return summary;
  }

  /**
   * Create a concise summary of a single search result
   */
  private static summarizeSearchResult(searchResult: any): string {
    let summary = `検索クエリ: ${searchResult.query}\n`;
    
    if (searchResult.results && searchResult.results.length > 0) {
      summary += `結果数: ${searchResult.results.length}\n`;
      summary += '主要な検索結果:\n';
      
      // Take top 3 results and summarize
      const topResults = searchResult.results.slice(0, 3);
      topResults.forEach((item: any, index: number) => {
        summary += `${index + 1}. ${item.title}\n`;
        // Truncate snippet to reasonable length
        const snippet = item.snippet || item.content || '';
        const truncatedSnippet = snippet.length > 200 
          ? snippet.substring(0, 200) + '...' 
          : snippet;
        summary += `   ${truncatedSnippet}\n`;
      });
    } else {
      summary += '結果なし\n';
    }

    return summary;
  }

  /**
   * Optimize content for OpenAI analysis by summarizing and truncating
   */
  static optimizeForAnalysis(
    systemPrompt: string,
    userContent: string,
    model: string = 'gpt-4o-mini'
  ): string {
    const availableTokens = this.getAvailableTokens(model, systemPrompt);
    const contentTokens = this.estimateTokens(userContent);

    console.log(`📊 Token analysis: ${contentTokens} content tokens, ${availableTokens} available`);

    if (contentTokens <= availableTokens) {
      console.log(`✅ Content fits within token limit`);
      return userContent;
    }

    console.log(`⚠️ Content exceeds limit, truncating to ${availableTokens} tokens`);
    return this.truncateToTokenLimit(userContent, availableTokens);
  }
}