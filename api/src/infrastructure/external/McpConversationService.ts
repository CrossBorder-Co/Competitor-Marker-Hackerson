import type { IMcpService, McpQueryResult } from '../../domain/interfaces/IMcpService.js';
import OpenAI from 'openai';

export interface ConversationResult {
  response: string;
  mcpData: string;
  timestamp: Date;
}

export class McpConversationService {
  private openai: OpenAI;
  private mcpService: IMcpService;

  constructor(openaiApiKey: string, mcpService: IMcpService) {
    this.openai = new OpenAI({ apiKey: openaiApiKey });
    this.mcpService = mcpService;
  }

  async processConversation(userQuery: string): Promise<ConversationResult> {
    console.log(`💬 Processing conversation: "${userQuery}"`);

    let sessionId: string | null = null;

    try {
      sessionId = await this.mcpService.initializeSession();

      const mcpResult = await this.mcpService.queryData(sessionId, userQuery, [1, 66]);

      const systemPrompt = this.buildSystemPrompt();
      const userPrompt = this.buildUserPrompt(userQuery, mcpResult.data);

      console.log('🤖 Generating OpenAI response...');
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1500
      });

      const response = completion.choices[0]?.message?.content || 'No response generated';

      console.log('✅ Conversation processed successfully');
      console.log(response);

      return {
        response,
        mcpData: mcpResult.data,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('❌ Conversation processing failed:', error);
      throw new Error(`Failed to process conversation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      if (sessionId) {
        await this.mcpService.closeSession(sessionId);
      }
    }
  }

  private buildSystemPrompt(): string {
    return `You are an AI assistant specialized in analyzing business and market data. You have access to comprehensive data about companies, people, project actions, intent signals, and keywords from a specialized database.
Your role is to:
1. Analyze the provided data context carefully
2. Answer user questions based on the available data
3. Provide specific, actionable insights
4. Focus on companies, people, and business activities
5. Highlight relevant intent signals and market trends
6. Be concise but comprehensive in your responses
When the data is limited or unclear, acknowledge this and provide the best analysis possible with the available information.`;
  }

  private buildUserPrompt(userQuery: string, mcpData: string): string {
    return `User Question: ${userQuery}
Available Data Context:
${mcpData}
Please analyze the above data and provide a comprehensive answer to the user's question. Focus on extracting relevant companies, people, project actions, and intent signals that match the user's query.`;
  }
}