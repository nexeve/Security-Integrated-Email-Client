import { RawEmail, AnalysisResult } from '../types';

/**
 * Analysis Engine Interface
 * 
 * This interface defines the contract for email security analysis.
 * The implementation can be heuristic-based (prototype) or ML-based (production)
 * without requiring changes to the frontend or API layer.
 */
export interface AnalysisEngine {
  analyze(email: RawEmail): AnalysisResult;
}

/**
 * Analysis Configuration
 * 
 * Configuration options for the analysis engine.
 * In production, this would include model paths, API keys, etc.
 */
export interface AnalysisConfig {
  enableHeuristics: boolean;
  enableML?: boolean; // For future Python/ML integration
  threatIntelligenceEnabled?: boolean; // For future external feeds
  geolocationEnabled?: boolean;
}
