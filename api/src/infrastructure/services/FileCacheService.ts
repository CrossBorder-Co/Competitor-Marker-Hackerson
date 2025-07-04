import type { ICacheService } from '../../domain/interfaces/ICacheService.js';
import type { SearchResult, CompetitorResearch } from '../../domain/models/Company.js';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export class FileCacheService implements ICacheService {
  private cacheDir: string;
  private ttlHours: number;

  constructor(cacheDir: string, ttlHours: number = 24) {
    this.cacheDir = cacheDir;
    this.ttlHours = ttlHours;
    this.ensureCacheDir();
  }

  private async ensureCacheDir(): Promise<void> {
    try {
      await fs.mkdir(this.cacheDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create cache directory:', error);
    }
  }

  generateCacheKey(companyId: string, competitorName: string, searchType: string): string {
    const input = `${companyId}-${competitorName}-${searchType}`;
    return crypto.createHash('md5').update(input).digest('hex');
  }

  async getSearchResult(key: string): Promise<SearchResult | null> {
    try {
      const filePath = path.join(this.cacheDir, `search-${key}.json`);
      const data = await fs.readFile(filePath, 'utf-8');
      const cached = JSON.parse(data);
      
      if (this.isExpired(cached.cachedAt)) {
        await this.deleteFile(filePath);
        return null;
      }
      
      return {
        ...cached.data,
        timestamp: new Date(cached.data.timestamp)
      };
    } catch (error) {
      return null;
    }
  }

  async setSearchResult(key: string, result: SearchResult): Promise<void> {
    try {
      await this.ensureCacheDir();
      const filePath = path.join(this.cacheDir, `search-${key}.json`);
      const cached = {
        data: result,
        cachedAt: new Date().toISOString()
      };
      await fs.writeFile(filePath, JSON.stringify(cached, null, 2));
    } catch (error) {
      console.error('Failed to cache search result:', error);
    }
  }

  async getCompetitorResearch(companyId: string, competitorName: string): Promise<CompetitorResearch | null> {
    try {
      const key = this.generateCacheKey(companyId, competitorName, 'research');
      const filePath = path.join(this.cacheDir, `research-${key}.json`);
      const data = await fs.readFile(filePath, 'utf-8');
      const cached = JSON.parse(data);
      
      if (this.isExpired(cached.cachedAt)) {
        await this.deleteFile(filePath);
        return null;
      }
      
      return {
        ...cached.data,
        lastUpdated: new Date(cached.data.lastUpdated)
      };
    } catch (error) {
      return null;
    }
  }

  async setCompetitorResearch(companyId: string, competitorName: string, research: CompetitorResearch): Promise<void> {
    try {
      await this.ensureCacheDir();
      const key = this.generateCacheKey(companyId, competitorName, 'research');
      const filePath = path.join(this.cacheDir, `research-${key}.json`);
      const cached = {
        data: research,
        cachedAt: new Date().toISOString()
      };
      await fs.writeFile(filePath, JSON.stringify(cached, null, 2));
    } catch (error) {
      console.error('Failed to cache competitor research:', error);
    }
  }

  private isExpired(cachedAt: string): boolean {
    const cacheTime = new Date(cachedAt);
    const now = new Date();
    const diffHours = (now.getTime() - cacheTime.getTime()) / (1000 * 60 * 60);
    return diffHours > this.ttlHours;
  }

  private async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
    } catch (error) {
    }
  }
}
