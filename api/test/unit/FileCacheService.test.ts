import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { FileCacheService } from '../../src/infrastructure/cache/FileCacheService.js';
import { SearchResult, CompetitorResearch } from '../../src/domain/models/Company.js';
import fs from 'fs/promises';
import path from 'path';
import { rimraf } from 'rimraf';

describe('FileCacheService', () => {
  let cacheService: FileCacheService;
  let testCacheDir: string;

  beforeEach(async () => {
    testCacheDir = path.join(process.cwd(), 'test-cache');
    cacheService = new FileCacheService(testCacheDir, 1); // 1 hour TTL for testing
  });

  afterEach(async () => {
    // Clean up test cache directory
    await rimraf(testCacheDir);
  });

  describe('generateCacheKey', () => {
    it('should generate consistent cache keys', () => {
      const key1 = cacheService.generateCacheKey('company1', 'competitor1', 'search');
      const key2 = cacheService.generateCacheKey('company1', 'competitor1', 'search');
      const key3 = cacheService.generateCacheKey('company1', 'competitor2', 'search');

      expect(key1).toBe(key2);
      expect(key1).not.toBe(key3);
      expect(key1).toMatch(/^[a-f0-9]{32}$/); // MD5 hash format
    });
  });

  describe('SearchResult caching', () => {
    it('should store and retrieve search results', async () => {
      const searchResult: SearchResult = {
        query: 'test query',
        results: [
          {
            title: 'Test Title',
            url: 'https://test.com',
            snippet: 'Test snippet',
          },
        ],
        timestamp: new Date(),
        language: 'JP',
      };

      const cacheKey = 'test-search-key';

      await cacheService.setSearchResult(cacheKey, searchResult);
      const retrieved = await cacheService.getSearchResult(cacheKey);

      expect(retrieved).toBeDefined();
      expect(retrieved?.query).toBe(searchResult.query);
      expect(retrieved?.results).toEqual(searchResult.results);
      expect(retrieved?.language).toBe(searchResult.language);
    });

    it('should return null for non-existent cache keys', async () => {
      const result = await cacheService.getSearchResult('non-existent-key');
      expect(result).toBeNull();
    });
  });

  describe('CompetitorResearch caching', () => {
    it('should store and retrieve competitor research', async () => {
      const research: CompetitorResearch = {
        companyId: '123',
        competitorName: 'Test Competitor',
        mainProducts: ['Product 1', 'Product 2'],
        keyFeatures: ['Feature 1', 'Feature 2'],
        strengths: ['Strength 1'],
        weaknesses: ['Weakness 1'],
        marketPosition: 'Market leader',
        comparisonNotes: 'Test comparison',
        lastUpdated: new Date(),
      };

      await cacheService.setCompetitorResearch('123', 'Test Competitor', research);
      const retrieved = await cacheService.getCompetitorResearch('123', 'Test Competitor');

      expect(retrieved).toBeDefined();
      expect(retrieved?.companyId).toBe(research.companyId);
      expect(retrieved?.competitorName).toBe(research.competitorName);
      expect(retrieved?.mainProducts).toEqual(research.mainProducts);
      expect(retrieved?.keyFeatures).toEqual(research.keyFeatures);
    });

    it('should return null for non-existent research', async () => {
      const result = await cacheService.getCompetitorResearch('non-existent', 'competitor');
      expect(result).toBeNull();
    });
  });
});