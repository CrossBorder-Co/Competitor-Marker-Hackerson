import type { McpConversationInput, McpConversationOutput } from '../dto/McpDto.js';
import { Agent, run, MCPServerStreamableHttp } from '@openai/agents'

export class McpConversationUseCase {
  private agent;
  private mcpServer;
  constructor() {

        this.mcpServer = new MCPServerStreamableHttp({
          url: 'https://search-mcp.salesmarker-server.com/mcp/',
          name: 'Sales Marker MCP Server',
        });
        this.agent = new Agent({
          name: 'Sales Marker Data Assistant',
          instructions: 'Use the tools to respond to user requests.',
          mcpServers: [this.mcpServer],
        });
  }

  async execute(input: McpConversationInput): Promise<McpConversationOutput> {
    console.log(`🎯 Executing MCP conversation use case: "${input.query}"`);
    
    if (!input.query || input.query.trim().length === 0) {
      throw new Error('Query is required and cannot be empty');
    }
    
    try {
      await this.mcpServer.connect();
      const result = await run(this.agent, input.query);
      console.log(result.finalOutput);
      await this.mcpServer.close();
      return {
        response: result.finalOutput || "",
      }
    } catch (error) {
      console.error('❌ MCP conversation use case failed:', error);
      throw new Error(`Failed to execute MCP conversation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
