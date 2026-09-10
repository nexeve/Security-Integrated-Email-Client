import { RawEmail, ExtendedAnalysisResult } from '../types';

/**
 * Analysis Engine Interface
 * 
 * This interface defines the contract for email security analysis.
 * The implementation can be heuristic-based (prototype) or ML-based (production)
 * without requiring changes to the frontend or API layer.
 */

export interface AnalysisOptions {
  /**
   * When true, geolocation lookups are skipped entirely — no external network
   * requests are made.  Geo fields in the result will be "Unavailable".
   *
   * Use for the inbox list endpoint where geo is not needed and should not
   * delay the response.  The individual email detail endpoint should always
   * call with skipGeo = false (default) so the Analytics map has real data.
   */
  skipGeo?: boolean;
}

export interface AnalysisEngine {
  analyze(email: RawEmail, options?: AnalysisOptions): Promise<ExtendedAnalysisResult>;
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
