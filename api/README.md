# Competitor Research API

A TypeScript API built with tRPC that researches Japanese company competitors using web search and AI analysis.

## Features

- **Web Search**: Uses Tavily API for comprehensive competitor research
- **AI Analysis**: OpenAI integration for intelligent competitor analysis
- **Caching**: File-based caching system for search results and analyses
- **Japanese Language Support**: All searches and analyses performed in Japanese
- **Type Safety**: Built with TypeScript and Zod for runtime validation
- **Domain-Driven Design**: Clean architecture with proper separation of concerns
- **Testing**: Comprehensive unit tests with Vitest

## API Endpoints

### `researchCompetitors`

Research competitors for a given Japanese company.

**Input:**
```typescript
{
  companyId: string;
  options?: {
    language?: 'EN' | 'JP'; // Default: 'JP'
    mode?: 'normal' | 'deep'; // Default: 'normal'
    limit?: number; // Default: 10, Min: 1, Max: 50
  };
}
```

**Output:**
```typescript
Array<{
  companyId: string;
  competitorName: string;
  mainProducts: string[];
  keyFeatures: string[];
  strengths: string[];
  weaknesses: string[];
  marketPosition: string;
  comparisonNotes: string;
  websiteUrl?: string;
  lastUpdated: Date;
}>
```

### `health`

Health check endpoint.

**Output:**
```typescript
{
  status: string;
  timestamp: Date;
}
```

## Setup for Development

### Prerequisites

- [Bun](https://bun.sh/) runtime
- Tavily API key
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hackathon-2025/api
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
```env
TAVILY_API_KEY=your_tavily_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
PORT=3001
NODE_ENV=development
CACHE_DIR=./cache
CACHE_TTL_HOURS=24
```

4. Start the development server:
```bash
bun run dev
```

The API will be available at `http://localhost:3001`

### Scripts

- `bun run dev` - Start development server with hot reload
- `bun run start` - Start production server
- `bun run build` - Build the project
- `bun run test` - Run tests
- `bun run test:watch` - Run tests in watch mode
- `bun run lint` - Run ESLint
- `bun run type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── domain/
│   ├── models/           # Domain models and types
│   ├── interfaces/       # Domain service interfaces
│   └── services/         # Domain services
├── infrastructure/
│   ├── cache/           # Caching implementations
│   ├── external/        # External service integrations
│   └── DIContainer.ts   # Dependency injection container
├── application/
│   ├── usecases/        # Application use cases
│   └── dto/             # Data transfer objects
├── presentation/
│   ├── controllers/     # API controllers
│   ├── middleware/      # Express middleware
│   └── trpc/           # tRPC router and context
└── index.ts            # Application entry point
```

## Architecture

The API follows Domain-Driven Design principles:

- **Domain Layer**: Contains business logic, models, and interfaces
- **Application Layer**: Contains use cases and application-specific logic
- **Infrastructure Layer**: Contains implementations of external services
- **Presentation Layer**: Contains API controllers and HTTP handling

## Testing

Run tests with:
```bash
bun run test
```

The test suite includes:
- Unit tests for use cases
- Integration tests for services
- Mock implementations for external dependencies

## Caching

The API implements a file-based caching system:
- Search results are cached for 24 hours (configurable)
- Both structured JSON and unstructured text formats are stored
- Cache keys are generated using MD5 hashes for consistency

## Error Handling

The API includes comprehensive error handling:
- Validation errors for invalid inputs
- Service errors for external API failures
- Graceful degradation when competitors can't be researched

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

MIT
