import type { IMcpService, McpQueryResult } from '../../domain/interfaces/IMcpService.js';
import fetch from 'node-fetch';

export class McpService implements IMcpService {
  private baseUrl: string;
  private activeSessions: Set<string> = new Set();

  constructor(baseUrl: string = 'https://search-mcp.salesmarker-server.com/mcp/') {
    this.baseUrl = baseUrl;
  }

  async initializeSession(): Promise<string> {
    console.log('🔗 Initializing MCP session...');
    
    try {
      const initRequest = {
        jsonrpc: '2.0',
        method: 'initialize',
        params: {
          capabilities: {
            roots: { listChanged: true },
            sampling: {}
          },
          clientInfo: {
            name: 'competitor-research-api',
            version: '1.0.0'
          },
          protocolVersion: '2024-11-05'
        },
        id: 'init-' + Date.now()
      };

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/event-stream'
        },
        body: JSON.stringify(initRequest)
      });

      if (!response.ok) {
        throw new Error(`MCP initialization failed: ${response.status} ${response.statusText}`);
      }

      const sessionId = response.headers.get('mcp-session-id');
      if (!sessionId) {
        throw new Error('No session ID received from MCP server');
      }

      const responseText = await response.text();
      console.log('✅ MCP session initialized:', sessionId);
      
      this.activeSessions.add(sessionId);
      return sessionId;
    } catch (error) {
      console.error('❌ MCP session initialization failed:', error);
      throw new Error(`Failed to initialize MCP session: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async queryData(sessionId: string, query: string, subIds: number[] = [1, 66]): Promise<McpQueryResult> {
    console.log(`🔍 Querying MCP data for session ${sessionId}: "${query}"`);
    
    try {
      const enhancedQuery = this.enhanceQueryWithSubIds(query, subIds);
      
      const queryRequest = {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'search',
          arguments: {
            query: enhancedQuery,
            sub_ids: subIds
          }
        },
        id: 'query-' + Date.now()
      };

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/event-stream',
          'mcp-session-id': sessionId
        },
        body: JSON.stringify(queryRequest)
      });

      if (!response.ok) {
        throw new Error(`MCP query failed: ${response.status} ${response.statusText}`);
      }

      const responseText = await response.text();
      console.log('📊 MCP query response received');
      
      let data = responseText;
      if (responseText.includes('event: message')) {
        const lines = responseText.split('\n');
        const dataLine = lines.find(line => line.startsWith('data: '));
        if (dataLine) {
          const jsonData = JSON.parse(dataLine.substring(6));
          data = jsonData.result?.content || jsonData.result || responseText;
        }
      }

      return {
        data: typeof data === 'string' ? data : JSON.stringify(data),
        timestamp: new Date(),
        sessionId
      };
    } catch (error) {
      console.error('❌ MCP query failed:', error);
      throw new Error(`Failed to query MCP data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async closeSession(sessionId: string): Promise<void> {
    console.log(`🔒 Closing MCP session: ${sessionId}`);
    
    try {
      this.activeSessions.delete(sessionId);
      console.log('✅ MCP session closed');
    } catch (error) {
      console.error('❌ Failed to close MCP session:', error);
    }
  }

  private enhanceQueryWithSubIds(query: string, subIds: number[]): string {
    const subIdFilter = subIds.length > 0 ? ` (focus on sub IDs: ${subIds.join(', ')})` : '';
    return `${query}${subIdFilter} - Include company, person, project action data, intent signals and keywords.`;
  }
}
