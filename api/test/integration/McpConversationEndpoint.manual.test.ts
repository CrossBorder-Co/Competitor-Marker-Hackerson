import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import { DIContainer } from '../../src/infrastructure/DIContainer.js';

describe('MCP Conversation Manual Test (with real API key)', () => {
  let container: DIContainer;

  beforeAll(async () => {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'test-key') {
      console.log('⚠️ Skipping manual test - OPENAI_API_KEY not provided');
      return;
    }

    container = new DIContainer({
      tavilyApiKey: process.env.TAVILY_API_KEY || 'test-key',
      openaiApiKey: process.env.OPENAI_API_KEY,
      cacheDir: './test-cache',
      cacheTtlHours: 1,
      mcpServerUrl: 'https://search-mcp.salesmarker-server.com/mcp/',
    });
  });

  it('should process MCP conversation with real OpenAI API', async () => {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'test-key') {
      console.log('⚠️ Skipping test - OPENAI_API_KEY not provided');
      return;
    }

    const testQuery = "Tell me 3 companies interested in Sales Marker in recent 1 week";
    
    const requestBody = {
      query: testQuery,
      subIds: [1, 66]
    };

    console.log('🧪 Testing MCP conversation with real API...');
    console.log('📝 Query:', testQuery);

    try {
      const mcpUseCase = container.getMcpConversationUseCase();
      const result = await mcpUseCase.execute(requestBody);
      
      console.log('📋 Response received:', {
        hasResponse: !!result.response,
        hasMcpData: !!result.mcpData,
        timestamp: result.timestamp,
        responseLength: result.response.length,
        mcpDataLength: result.mcpData.length
      });

      expect(result).toHaveProperty('response');
      expect(result).toHaveProperty('mcpData');
      expect(result).toHaveProperty('timestamp');
      expect(typeof result.response).toBe('string');
      expect(typeof result.mcpData).toBe('string');
      expect(result.response.length).toBeGreaterThan(0);
      
      console.log('✅ MCP conversation with real API completed successfully');
      console.log('📄 Sample response:', result.response.substring(0, 200) + '...');
    } catch (error) {
      console.error('❌ Test failed:', error);
      throw error;
    }
  }, 120000);
});
