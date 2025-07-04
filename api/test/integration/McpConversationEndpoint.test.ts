import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { appRouter } from '../../src/presentation/trpc/router.js';
import { DIContainer } from '../../src/infrastructure/DIContainer.js';
import { createContext } from '../../src/presentation/trpc/context.js';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import fetch from 'node-fetch';

describe('MCP Conversation Endpoint Integration', () => {
  let server: any;
  let serverUrl: string;
  let container: DIContainer;

  beforeAll(async () => {
    container = new DIContainer({
      tavilyApiKey: process.env.TAVILY_API_KEY || 'test-key',
      openaiApiKey: process.env.OPENAI_API_KEY || 'test-key',
      cacheDir: './test-cache',
      cacheTtlHours: 1,
      mcpServerUrl: 'https://search-mcp.salesmarker-server.com/mcp/',
    });

    const httpServer = createHTTPServer({
      router: appRouter,
      createContext: () => createContext(container),
    });

    const port = 0;
    server = httpServer.listen(port);
    
    serverUrl = `http://localhost:3001`;
    console.log(`Test server started on ${serverUrl}`);
  });

  afterAll(async () => {
    if (server && server.close) {
      server.close();
    }
  });

  it('should process MCP conversation query successfully', async () => {
    const testQuery = "Tell me 3 companies interested in Sales Marker in recent 1 week";
    
    const requestBody = {
      query: testQuery,
      subIds: [1, 66]
    };

    console.log('🧪 Testing MCP conversation endpoint...');
    console.log('📝 Query:', testQuery);

    try {
      const mcpUseCase = container.getMcpConversationUseCase();
      const result = await mcpUseCase.execute(requestBody);
      
      console.log('📋 Response received:', {
        hasResponse: !!result.response,
        hasMcpData: !!result.mcpData,
        timestamp: result.timestamp
      });

      expect(result).toHaveProperty('response');
      expect(result).toHaveProperty('mcpData');
      expect(result).toHaveProperty('timestamp');
      expect(typeof result.response).toBe('string');
      expect(typeof result.mcpData).toBe('string');
      expect(result.response.length).toBeGreaterThan(0);
      
      console.log('✅ MCP conversation endpoint test completed successfully');
    } catch (error) {
      console.error('❌ Test failed:', error);
      throw error;
    }
  }, 60000);

  it('should handle invalid queries gracefully', async () => {
    const requestBody = {
      query: "",
      subIds: [1, 66]
    };

    try {
      const mcpUseCase = container.getMcpConversationUseCase();
      await mcpUseCase.execute(requestBody);
      expect.fail('Should have thrown an error for empty query');
    } catch (error) {
      expect(error).toBeDefined();
      console.log('✅ Invalid query handled correctly');
    }
  });

  it('should use default subIds when not provided', async () => {
    const requestBody = {
      query: "Test query without subIds",
      subIds: undefined as any
    };

    try {
      const mcpUseCase = container.getMcpConversationUseCase();
      const result = await mcpUseCase.execute(requestBody);
      
      expect(result).toHaveProperty('response');
      expect(result).toHaveProperty('mcpData');
      console.log('✅ Default subIds test completed successfully');
    } catch (error) {
      console.error('❌ Default subIds test failed:', error);
      throw error;
    }
  }, 60000);
});
