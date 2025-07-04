export interface McpQueryResult {
  data: string;
  timestamp: Date;
  sessionId: string;
}

export interface IMcpService {
  initializeSession(): Promise<string>;
  queryData(sessionId: string, query: string, subIds?: number[]): Promise<McpQueryResult>;
  closeSession(sessionId: string): Promise<void>;
}