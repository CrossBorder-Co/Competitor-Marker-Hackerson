import type { MarketAnalysisRequest, MarketAnalysisResponse } from '../models/MarketAnalysis.js';

export interface IMarketAnalysisService {
  analyzeMarketEnvironment(request: MarketAnalysisRequest): Promise<MarketAnalysisResponse>;
  analyzeThreatEnvironment(request: MarketAnalysisRequest): Promise<MarketAnalysisResponse>;
}