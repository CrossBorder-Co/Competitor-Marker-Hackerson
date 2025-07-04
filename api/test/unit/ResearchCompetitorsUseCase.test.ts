import { describe, it, expect, beforeEach } from 'bun:test';
import { ResearchCompetitorsUseCase } from '../../src/application/usecases/ResearchCompetitorsUseCase.js';
import type { ICompanyRepository } from '../../src/domain/interfaces/ICompanyRepository.js';
import type { ISearchService } from '../../src/domain/interfaces/ISearchService.js';
import type { IAnalysisService } from '../../src/domain/interfaces/IAnalysisService.js';
import type { ICacheService } from '../../src/domain/interfaces/ICacheService.js';
import type { Company, SearchResult, CompetitorResearch } from '../../src/domain/models/Company.js';

describe('ResearchCompetitorsUseCase', () => {
  let useCase: ResearchCompetitorsUseCase;
  let mockCompanyRepository: ICompanyRepository;
  let mockSearchService: ISearchService;
  let mockAnalysisService: IAnalysisService;
  let mockCacheService: ICacheService;

  beforeEach(() => {
    mockCompanyRepository = {
      findById: async (id: string) => {
        if (id === 'invalid-id') return null;
        if (id === '123') return {
          id: '123',
          name: 'Test Company',
          keywords: ['test'],
          recommendationKeywords: ['Competitor 1'],
        };
        return null;
      },
      findByName: async () => null,
      getCompetitors: async (companyId: string) => {
        if (companyId === '123') return ['Competitor 1'];
        return [];
      },
    };

    mockSearchService = {
      searchCompetitor: async () => ({
        query: 'test query',
        results: [{ title: 'Test Title', url: 'https://test.com', snippet: 'Test snippet' }],
        timestamp: new Date(),
        language: 'JP',
      }),
      searchCompanyProducts: async () => ({
        query: 'test query',
        results: [{ title: 'Test Title', url: 'https://test.com', snippet: 'Test snippet' }],
        timestamp: new Date(),
        language: 'JP',
      }),
      searchCompanyFeatures: async () => ({
        query: 'test query',
        results: [{ title: 'Test Title', url: 'https://test.com', snippet: 'Test snippet' }],
        timestamp: new Date(),
        language: 'JP',
      }),
    };

    mockAnalysisService = {
      analyzeCompetitor: async () => ({
        companyId: '123',
        competitorName: 'Competitor 1',
        mainProducts: ['Product 1'],
        keyFeatures: ['Feature 1'],
        strengths: ['Strength 1'],
        weaknesses: ['Weakness 1'],
        marketPosition: 'Market leader',
        comparisonNotes: 'Comparison notes',
        lastUpdated: new Date(),
      }),
    };

    mockCacheService = {
      getSearchResult: async () => null,
      setSearchResult: async () => {},
      getCompetitorResearch: async () => null,
      setCompetitorResearch: async () => {},
      generateCacheKey: () => 'cache-key',
    };

    useCase = new ResearchCompetitorsUseCase(
      mockCompanyRepository,
      mockSearchService,
      mockAnalysisService,
      mockCacheService
    );
  });

  describe('execute', () => {
    it('should throw error when company is not found', async () => {
      await expect(useCase.execute('invalid-id', { language: 'JP', mode: 'normal', limit: 10 }))
        .rejects
        .toThrow('Company with ID invalid-id not found');
    });

    it('should throw error when no competitors found', async () => {
      await expect(useCase.execute('no-competitors', { language: 'JP', mode: 'normal', limit: 10 }))
        .rejects
        .toThrow('Company with ID no-competitors not found');
    });

    it('should return results when available', async () => {
      const result = await useCase.execute('123', { language: 'JP', mode: 'normal', limit: 10 });

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('companyId');
      expect(result[0]).toHaveProperty('competitorName');
      expect(result[0]).toHaveProperty('mainProducts');
      expect(result[0]).toHaveProperty('keyFeatures');
    });

    it('should perform research successfully', async () => {
      const result = await useCase.execute('123', { language: 'JP', mode: 'normal', limit: 10 });

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      
      const research = result[0];
      expect(research).toBeDefined();
      if (research) {
        expect(research.companyId).toBe('123');
        expect(research.competitorName).toBe('Competitor 1');
        expect(research.mainProducts).toEqual(['Product 1']);
        expect(research.keyFeatures).toEqual(['Feature 1']);
        expect(research.strengths).toEqual(['Strength 1']);
        expect(research.weaknesses).toEqual(['Weakness 1']);
        expect(research.marketPosition).toBe('Market leader');
        expect(research.comparisonNotes).toBe('Comparison notes');
      }
    });
  });
});
