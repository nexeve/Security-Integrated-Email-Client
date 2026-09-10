import { ThreatIndicator, ScoreFactor, EmailCategory, Verdict, RiskLevel } from '../types';
import { AuthenticationFindings } from './analyzers/authentication';

export interface ScoringResult {
  safetyScore: number;
  category: EmailCategory;
  verdict: Verdict;
  riskLevel: RiskLevel;
  scoreFactors: ScoreFactor[];
}

export function calculateCorrelatedScore(
  auth: AuthenticationFindings,
  indicators: ThreatIndicator[]
): ScoringResult {
  const scoreFactors: ScoreFactor[] = [];
  let score = 100; // Start with a perfect score (No threat detected)

  // 1. Authentication Impact
  if (auth.spf.status === 'fail' || auth.dkim.status === 'fail' || auth.dmarc.status === 'fail') {
    scoreFactors.push({
      factor: 'Authentication Failure',
      impact: -20,
      description: 'One or more authentication mechanisms explicitly failed.'
    });
    score -= 20;
  } else if (auth.spf.status === 'unknown' && auth.dkim.status === 'unknown') {
    // Missing auth entirely
    scoreFactors.push({
      factor: 'Missing Authentication',
      impact: -5,
      description: 'Standard authentication headers are missing or unavailable.'
    });
    score -= 5;
  }

  // 2. Correlate Indicators
  // We group social engineering, spoofing, phishing, malware to avoid linear double-counting
  const categories = new Set(indicators.map(i => i.category));

  for (const category of categories) {
    const categoryIndicators = indicators.filter(i => i.category === category);
    
    // Find highest severity in this category
    let maxSeverityValue = 0;
    for (const ind of categoryIndicators) {
      if (ind.severity === 'critical') maxSeverityValue = Math.max(maxSeverityValue, 40);
      else if (ind.severity === 'high') maxSeverityValue = Math.max(maxSeverityValue, 25);
      else if (ind.severity === 'medium') maxSeverityValue = Math.max(maxSeverityValue, 15);
      else if (ind.severity === 'low') maxSeverityValue = Math.max(maxSeverityValue, 5);
    }
    
    // Assign impact for this category cluster
    if (maxSeverityValue > 0) {
      scoreFactors.push({
        factor: `${category.toUpperCase()} Indicators`,
        impact: -maxSeverityValue,
        description: `Evidence of ${category} behavior detected.`
      });
      score -= maxSeverityValue;
    }
  }

  // 3. Score bounds
  score = Math.max(0, Math.min(100, score));

  // 4. Determine Verdict and Risk Level
  let riskLevel: RiskLevel = 'safe';
  let verdict: Verdict = 'safe';
  let category: EmailCategory = 'normal';

  if (score >= 95) {
    riskLevel = 'safe';
    verdict = 'safe';
    category = 'normal';
  } else if (score >= 75) {
    riskLevel = 'low';
    verdict = 'likely_safe';
    category = 'normal';
  } else if (score >= 50) {
    riskLevel = 'medium';
    verdict = 'caution';
    category = 'suspicious';
  } else if (score >= 25) {
    riskLevel = 'high';
    verdict = 'suspicious';
    category = 'suspicious';
  } else {
    riskLevel = 'critical';
    verdict = 'malicious';
    category = 'malicious';
  }

  return { safetyScore: score, category, verdict, riskLevel, scoreFactors };
}
