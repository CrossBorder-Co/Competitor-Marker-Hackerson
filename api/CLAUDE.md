# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status

This appears to be a new or empty repository with no existing code, configuration files, or documentation. The repository is not yet initialized as a git repository and contains no files.

## Getting Started

Since this is an empty repository, you'll need to:
1. Initialize the project structure based on the intended technology stack
2. Set up version control with `git init` if needed
3. Create initial configuration files (package.json, requirements.txt, etc.) as appropriate
4. Establish project conventions and development workflow

## Notes for Future Development

- No existing architecture to preserve
- No existing dependencies or build tools configured
- No coding standards or conventions established yet
- Repository is located at: /Users/kavinvin/Repositories/sales-marker/hackathon-2025
- This appears to be a hackathon project based on the directory name
- Every time claude learn something new please add the knowledge in this file

## API Architecture

The API is built using:
- **tRPC**: For type-safe API endpoints
- **Bun**: As the runtime and package manager
- **TypeScript**: For type safety
- **Port**: Runs on localhost:3001

Available endpoints:
- `researchCompetitors`: Mutation for researching competitors
- `mcpConversation`: Mutation for MCP conversation
- `health`: Query for health check

## Website Architecture

The website is built using:
- **Next.js**: React framework
- **TypeScript**: For type safety
- **tRPC Client**: For API communication
- **Tailwind CSS**: For styling
- **Radix UI**: For components

The website connects to the API using tRPC client configured to communicate with localhost:3001.

## Caching System

The API implements a sophisticated file-based caching system that stores results in different directories:

- **Search Results**: `./cache/search/` - Caches web search results from Tavily API
- **Competitor Research**: `./cache/research/` - Caches competitor analysis results
- **Market Analysis**: `./cache/market-analysis/` - Caches environment and threat analysis results

Cache features:
- TTL-based expiration (default 24 hours)
- JSON format for structured data
- Text format for human-readable analysis
- MD5-based cache keys for consistent file naming
- Automatic cache invalidation on expiry

## Market Analysis with Web Search

Environment and threat analysis now include real-time web search data:

**Environment Analysis Searches:**
- Market environment and industry trends
- Market size and growth potential
- Industry competitive environment  
- Customer segments

**Threat Analysis Searches:**
- Competitors and threats
- Market new entrants
- Industry risks
- Competitive advantages

The system combines company data, competitor information, and fresh web search results to provide comprehensive market intelligence.
