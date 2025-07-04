import type { McpConversationInput, McpConversationOutput } from '../dto/ResearchDto.js';
import type { ICacheService } from '../../domain/interfaces/ICacheService.js';
import { McpConversationService } from '../../infrastructure/external/McpConversationService.js';

export class McpConversationUseCase {
  constructor(
    private mcpConversationService: McpConversationService,
    private cacheService: ICacheService
  ) {}

  async execute(input: McpConversationInput): Promise<McpConversationOutput> {
    console.log(`🎯 Executing MCP conversation use case: "${input.query}"`);
    
    if (!input.query || input.query.trim().length === 0) {
      throw new Error('Query is required and cannot be empty');
    }
    
    try {
      const safeSubIds = input.subIds || [1, 66];
      const cacheKey = this.generateCacheKey(input.query, safeSubIds);
      
      const cachedResult = await this.cacheService.getSearchResult(cacheKey);
      if (cachedResult) {
        console.log('💾 Using cached conversation result');
        return {
          response: cachedResult.results[0]?.snippet || 'Cached response',
          mcpData: cachedResult.results[0]?.content || 'Cached data',
          timestamp: cachedResult.timestamp
        };
      }
      
      const result = await this.mcpConversationService.processConversation(input.query);
      
      const searchResult = {
        query: input.query,
        results: [{
          title: 'MCP Conversation Result',
          url: 'mcp://conversation',
          snippet: result.response,
          content: result.mcpData
        }],
        timestamp: result.timestamp,
        language: 'EN' as const
      };
      
      await this.cacheService.setSearchResult(cacheKey, searchResult);
      
      console.log('✅ MCP conversation completed successfully');
      
      return {
        response: result.response,
        mcpData: result.mcpData,
        timestamp: result.timestamp
      };
    } catch (error) {
      console.error('❌ MCP conversation use case failed:', error);
      throw new Error(`Failed to execute MCP conversation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private generateCacheKey(query: string, subIds: number[]): string {
    const safeSubIds = subIds || [1, 66];
    const input = `mcp-conversation-${query}-${safeSubIds.join(',')}`;
    return Buffer.from(input).toString('base64').substring(0, 32);
  }
}
