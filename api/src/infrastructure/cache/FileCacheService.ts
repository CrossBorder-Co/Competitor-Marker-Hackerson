import type { ICacheService } from '../../domain/interfaces/ICacheService.js';
import type { SearchResult, CompetitorResearch } from '../../domain/models/Company.js';
import type { MarketAnalysisResponse } from '../../domain/models/MarketAnalysis.js';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export class FileCacheService implements ICacheService {
  private cacheDir: string;
  private ttlHours: number;

  constructor(cacheDir: string = './cache', ttlHours: number = 24) {
    this.cacheDir = cacheDir;
    this.ttlHours = ttlHours;
  }

  async getSearchResult(key: string): Promise<SearchResult | null> {
    try {
      const filePath = path.join(this.cacheDir, 'search', `${key}.json`);
      const stats = await fs.stat(filePath);
      
      // Check if cache is expired
      const ageHours = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60);
      if (ageHours > this.ttlHours) {
        await fs.unlink(filePath);
        return null;
      }

      const content = await fs.readFile(filePath, 'utf-8');
      const result = JSON.parse(content);
      result.timestamp = new Date(result.timestamp);
      return result;
    } catch (error) {
      return null;
    }
  }

  async setSearchResult(key: string, result: SearchResult): Promise<void> {
    try {
      const searchDir = path.join(this.cacheDir, 'search');
      await fs.mkdir(searchDir, { recursive: true });
      
      const filePath = path.join(searchDir, `${key}.json`);
      await fs.writeFile(filePath, JSON.stringify(result, null, 2));
      
      // Also save as unstructured text for LLM analysis
      const textPath = path.join(searchDir, `${key}.txt`);
      const textContent = this.formatSearchResultAsText(result);
      await fs.writeFile(textPath, textContent);
    } catch (error) {
      console.error('Error saving search result to cache:', error);
    }
  }

  async getCompetitorResearch(companyId: string, competitorName: string): Promise<CompetitorResearch | null> {
    try {
      const key = this.generateCacheKey(companyId, competitorName, 'research');
      const filePath = path.join(this.cacheDir, 'research', `${key}.json`);
      
      const stats = await fs.stat(filePath);
      
      // Check if cache is expired
      const ageHours = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60);
      if (ageHours > this.ttlHours) {
        await fs.unlink(filePath);
        return null;
      }

      const content = await fs.readFile(filePath, 'utf-8');
      const result = JSON.parse(content);
      result.lastUpdated = new Date(result.lastUpdated);
      return result;
    } catch (error) {
      return null;
    }
  }

  async setCompetitorResearch(companyId: string, competitorName: string, research: CompetitorResearch): Promise<void> {
    try {
      const key = this.generateCacheKey(companyId, competitorName, 'research');
      const researchDir = path.join(this.cacheDir, 'research');
      await fs.mkdir(researchDir, { recursive: true });
      
      const filePath = path.join(researchDir, `${key}.json`);
      await fs.writeFile(filePath, JSON.stringify(research, null, 2));
      
      // Also save as unstructured text for LLM analysis
      const textPath = path.join(researchDir, `${key}.txt`);
      const textContent = this.formatResearchAsText(research);
      await fs.writeFile(textPath, textContent);
    } catch (error) {
      console.error('Error saving research to cache:', error);
    }
  }

  async getMarketAnalysis(companyId: string, analysisType: 'environment' | 'threat'): Promise<MarketAnalysisResponse | null> {
    try {
      const key = this.generateMarketAnalysisCacheKey(companyId, analysisType);
      const filePath = path.join(this.cacheDir, 'market-analysis', `${key}.json`);
      
      const stats = await fs.stat(filePath);
      
      // Check if cache is expired
      const ageHours = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60);
      if (ageHours > this.ttlHours) {
        await fs.unlink(filePath);
        return null;
      }

      const content = await fs.readFile(filePath, 'utf-8');
      const result = JSON.parse(content);
      return result;
    } catch (error) {
      return null;
    }
  }

  async setMarketAnalysis(companyId: string, analysisType: 'environment' | 'threat', analysis: MarketAnalysisResponse): Promise<void> {
    try {
      const key = this.generateMarketAnalysisCacheKey(companyId, analysisType);
      const marketAnalysisDir = path.join(this.cacheDir, 'market-analysis');
      await fs.mkdir(marketAnalysisDir, { recursive: true });
      
      const filePath = path.join(marketAnalysisDir, `${key}.json`);
      await fs.writeFile(filePath, JSON.stringify(analysis, null, 2));
      
      // Also save as unstructured text for LLM analysis
      const textPath = path.join(marketAnalysisDir, `${key}.txt`);
      const textContent = this.formatMarketAnalysisAsText(analysis, analysisType);
      await fs.writeFile(textPath, textContent);
    } catch (error) {
      console.error('Error saving market analysis to cache:', error);
    }
  }

  generateCacheKey(companyId: string, competitorName: string, searchType: string): string {
    const input = `${companyId}-${competitorName}-${searchType}`;
    return crypto.createHash('md5').update(input).digest('hex');
  }

  generateMarketAnalysisCacheKey(companyId: string, analysisType: 'environment' | 'threat'): string {
    const input = `${companyId}-market-${analysisType}`;
    return crypto.createHash('md5').update(input).digest('hex');
  }

  private formatSearchResultAsText(result: SearchResult): string {
    let text = `Search Query: ${result.query}\n`;
    text += `Language: ${result.language}\n`;
    text += `Timestamp: ${result.timestamp.toISOString()}\n`;
    text += `Results Count: ${result.results.length}\n\n`;
    
    result.results.forEach((item, index) => {
      text += `=== Result ${index + 1} ===\n`;
      text += `Title: ${item.title}\n`;
      text += `URL: ${item.url}\n`;
      text += `Snippet: ${item.snippet}\n`;
      if (item.content) {
        text += `Content: ${item.content}\n`;
      }
      text += '\n';
    });
    
    return text;
  }

  private formatResearchAsText(research: CompetitorResearch): string {
    let text = `Competitor Research Report\n`;
    text += `Company ID: ${research.companyId}\n`;
    text += `Competitor: ${research.competitorName}\n`;
    text += `Last Updated: ${research.lastUpdated.toISOString()}\n\n`;
    
    text += `Main Products:\n`;
    research.mainProducts.forEach(product => {
      text += `- ${product}\n`;
    });
    text += '\n';
    
    text += `Key Features:\n`;
    research.keyFeatures.forEach(feature => {
      text += `- ${feature}\n`;
    });
    text += '\n';
    
    text += `Strengths:\n`;
    research.strengths.forEach(strength => {
      text += `- ${strength}\n`;
    });
    text += '\n';
    
    text += `Weaknesses:\n`;
    research.weaknesses.forEach(weakness => {
      text += `- ${weakness}\n`;
    });
    text += '\n';
    
    text += `Market Position:\n${research.marketPosition}\n\n`;
    text += `Comparison Notes:\n${research.comparisonNotes}\n`;
    
    if (research.websiteUrl) {
      text += `Website: ${research.websiteUrl}\n`;
    }
    
    return text;
  }

  private formatMarketAnalysisAsText(analysis: MarketAnalysisResponse, analysisType: 'environment' | 'threat'): string {
    let text = `Market Analysis Report - ${analysisType.charAt(0).toUpperCase() + analysisType.slice(1)}\n`;
    text += `Generated: ${new Date().toISOString()}\n\n`;
    
    text += `=== Analysis Results ===\n`;
    analysis.analysisResults.forEach((result, index) => {
      text += `${index + 1}. ${result.topicTitle}\n`;
      text += `${result.analysisContent}\n\n`;
    });
    
    text += `=== Relation Results ===\n`;
    analysis.relationResults.forEach((result, index) => {
      text += `${index + 1}. ${result.similarCompanyName}\n`;
      text += `Analysis: ${result.specificAnalysisResultBetweenTargetCompany}\n`;
      text += `Recommendation: ${result.recommendationNextActionBetweenTargetCompany}\n\n`;
    });
    
    return text;
  }
}