import { describe, it, expect, vi, beforeEach } from 'vitest';
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
      findById: vi.fn(),
      findByName: vi.fn(),
      getCompetitors: vi.fn(),
    };

    mockSearchService = {
      searchCompetitor: vi.fn(),
      searchCompanyProducts: vi.fn(),
      searchCompanyFeatures: vi.fn(),
    };

    mockAnalysisService = {
      analyzeCompetitor: vi.fn(),
    };

    mockCacheService = {
      getSearchResult: vi.fn(),
      setSearchResult: vi.fn(),
      getCompetitorResearch: vi.fn(),
      setCompetitorResearch: vi.fn(),
      generateCacheKey: vi.fn(),
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
      vi.mocked(mockCompanyRepository.findById).mockResolvedValue(null);

      await expect(useCase.execute('invalid-id', { language: 'JP', mode: 'normal', limit: 10 }))
        .rejects
        .toThrow('Company with ID invalid-id not found');
    });

    it('should throw error when no competitors found', async () => {
      const mockCompany: Company = {
        id: '123',
        name: 'Test Company',
        keywords: ['test'],
        recommendationKeywords: [],
      };

      vi.mocked(mockCompanyRepository.findById).mockResolvedValue(mockCompany);
      vi.mocked(mockCompanyRepository.getCompetitors).mockResolvedValue([]);

      await expect(useCase.execute('123', { language: 'JP', mode: 'normal', limit: 10 }))
        .rejects
        .toThrow('No competitors found for company 123');
    });

    it('should return cached results when available', async () => {
      const mockCompany: Company = {
        id: '123',
        name: 'Test Company',
        keywords: ['test'],
        recommendationKeywords: ['Competitor 1'],
      };

      const mockCachedResearch: CompetitorResearch = {
        companyId: '123',
        competitorName: 'Competitor 1',
        mainProducts: ['Product 1'],
        keyFeatures: ['Feature 1'],
        strengths: ['Strength 1'],
        weaknesses: ['Weakness 1'],
        marketPosition: 'Market leader',
        comparisonNotes: 'Comparison notes',
        lastUpdated: new Date(),
      };

      vi.mocked(mockCompanyRepository.findById).mockResolvedValue(mockCompany);
      vi.mocked(mockCompanyRepository.getCompetitors).mockResolvedValue(['Competitor 1']);
      vi.mocked(mockCacheService.getCompetitorResearch).mockResolvedValue(mockCachedResearch);

      const result = await useCase.execute('123', { language: 'JP', mode: 'normal', limit: 10 });

      expect(result).toEqual([mockCachedResearch]);
      expect(mockSearchService.searchCompetitor).not.toHaveBeenCalled();
    });

    it('should perform new research when not cached', async () => {
      const mockCompany: Company = {
        id: '123',
        name: 'Test Company',
        keywords: ['test'],
        recommendationKeywords: ['Competitor 1'],
      };

      const mockSearchResult: SearchResult = {
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

      const mockResearch: CompetitorResearch = {
        companyId: '123',
        competitorName: 'Competitor 1',
        mainProducts: ['Product 1'],
        keyFeatures: ['Feature 1'],
        strengths: ['Strength 1'],
        weaknesses: ['Weakness 1'],
        marketPosition: 'Market leader',
        comparisonNotes: 'Comparison notes',
        lastUpdated: new Date(),
      };

      vi.mocked(mockCompanyRepository.findById).mockResolvedValue(mockCompany);
      vi.mocked(mockCompanyRepository.getCompetitors).mockResolvedValue(['Competitor 1']);
      vi.mocked(mockCacheService.getCompetitorResearch).mockResolvedValue(null);
      vi.mocked(mockSearchService.searchCompetitor).mockResolvedValue(mockSearchResult);
      vi.mocked(mockSearchService.searchCompanyProducts).mockResolvedValue(mockSearchResult);
      vi.mocked(mockSearchService.searchCompanyFeatures).mockResolvedValue(mockSearchResult);
      vi.mocked(mockAnalysisService.analyzeCompetitor).mockResolvedValue(mockResearch);
      vi.mocked(mockCacheService.generateCacheKey).mockReturnValue('cache-key');

      const result = await useCase.execute('123', { language: 'JP', mode: 'normal', limit: 10 });

      expect(result).toEqual([mockResearch]);
      expect(mockSearchService.searchCompetitor).toHaveBeenCalledWith('Competitor 1', { language: 'JP', mode: 'normal' });
      expect(mockAnalysisService.analyzeCompetitor).toHaveBeenCalled();
      expect(mockCacheService.setCompetitorResearch).toHaveBeenCalledWith('123', 'Competitor 1', mockResearch);
    });
  });
});
