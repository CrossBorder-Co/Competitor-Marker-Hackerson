import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { appRouter } from './presentation/trpc/router.js';
import { createContext } from './presentation/trpc/context.js';
import { DIContainer } from './infrastructure/DIContainer.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['TAVILY_API_KEY', 'OPENAI_API_KEY'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Initialize dependency injection container
const container = new DIContainer({
  tavilyApiKey: process.env.TAVILY_API_KEY!,
  openaiApiKey: process.env.OPENAI_API_KEY!,
  cacheDir: process.env.CACHE_DIR || './cache',
  cacheTtlHours: parseInt(process.env.CACHE_TTL_HOURS || '24'),
});

// Create HTTP server
const server = createHTTPServer({
  router: appRouter,
  createContext: () => createContext(container),
  middleware: (req, res, next) => {
    // Log incoming requests
    const timestamp = new Date().toISOString();
    console.log(`\n📥 [${timestamp}] ${req.method} ${req.url}`);
    
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
      console.log(`📤 [${timestamp}] OPTIONS request handled`);
      res.writeHead(200);
      res.end();
      return;
    }
    
    next();
  },
});

const port = parseInt(process.env.PORT || '3001');

server.listen(port);

console.log(`🚀 Server running on http://localhost:${port}`);
console.log(`📊 Health check: http://localhost:${port}/health`);
console.log(`🔍 Research competitors: http://localhost:${port}/researchCompetitors`);
console.log(`🏢 Analyze environment: http://localhost:${port}/analyzeEnvironment`);
console.log(`⚠️  Analyze threat: http://localhost:${port}/analyzeThreat`);
console.log(`💬 MCP conversation: http://localhost:${port}/mcpConversation`);
