import { RawEmail, AnalysisResult, EmailCategory, SecurityCheckStatus, ThreatIndicator, SecurityCheckResult, GeolocationInfo, ForensicInfo, ScoreFactor } from '../types';
import { AnalysisEngine, AnalysisConfig } from './types';
import { checkSPF, checkDKIM, checkDMARC } from './rules/security-checks';
import { detectPhishing, detectSpoofing, detectSuspiciousAttachments } from './rules/threat-detection';
import { getGeolocation } from './mock/geolocation';
import { calculateSafetyScore, determineCategory } from './rules/scoring';

/**
 * Heuristic Analysis Engine
 * 
 * Prototype implementation using rule-based heuristics.
 * This can be replaced with Python/ML models while preserving the same interface.
 */
export class HeuristicAnalysisEngine implements AnalysisEngine {
  private config: AnalysisConfig;

  constructor(config: AnalysisConfig = { enableHeuristics: true }) {
    this.config = config;
  }

  analyze(email: RawEmail): AnalysisResult {
    // Step 1: Perform security checks
    const spfResult = checkSPF(email);
    const dkimResult = checkDKIM(email);
    const dmarcResult = checkDMARC(email);

    // Step 2: Detect threats
    const threatIndicators: ThreatIndicator[] = [];
    
    if (this.config.enableHeuristics) {
      threatIndicators.push(...detectPhishing(email));
      threatIndicators.push(...detectSpoofing(email));
      threatIndicators.push(...detectSuspiciousAttachments(email));
    }

    // Step 3: Get geolocation (mocked for prototype)
    const geolocation = getGeolocation(email.metadata?.ip || 'unknown');

    // Step 4: Calculate safety score and category
    const scoreFactors = calculateSafetyScore(
      email,
      spfResult,
      dkimResult,
      dmarcResult,
      threatIndicators
    );
    
    const safetyScore = this.computeFinalScore(scoreFactors);
    const category = determineCategory(safetyScore, threatIndicators);

    // Step 5: Generate forensic details
    const forensicDetails = this.generateForensicInfo(
      email,
      spfResult,
      dkimResult,
      dmarcResult,
      threatIndicators,
      scoreFactors,
      safetyScore
    );

    return {
      safetyScore,
      category,
      threatIndicators,
      securityChecks: {
        spf: spfResult,
        dkim: dkimResult,
        dmarc: dmarcResult,
      },
      geolocation,
      forensicDetails,
    };
  }

  private computeFinalScore(factors: ScoreFactor[]): number {
    const totalImpact = factors.reduce((sum, factor) => sum + factor.impact, 0);
    const baseScore = 100;
    const finalScore = Math.max(0, Math.min(100, baseScore + totalImpact));
    return Math.round(finalScore);
  }

  private generateForensicInfo(
    email: RawEmail,
    spf: SecurityCheckResult,
    dkim: SecurityCheckResult,
    dmarc: SecurityCheckResult,
    threats: ThreatIndicator[],
    scoreFactors: ScoreFactor[],
    safetyScore: number
  ): ForensicInfo {
    const highSeverityThreats = threats.filter(t => 
      t.severity === 'high' || t.severity === 'critical'
    );

    let summary = '';
    if (safetyScore >= 80) {
      summary = 'This email appears safe with strong security authentication.';
    } else if (safetyScore >= 50) {
      summary = 'This email has some security concerns that should be reviewed.';
    } else {
      summary = `This email exhibits ${highSeverityThreats.length} high-severity threat indicators and should be treated with caution.`;
    }

    const recommendations: string[] = [];
    if (spf.status !== 'pass') recommendations.push('SPF authentication failed - sender may be spoofed');
    if (dkim.status !== 'pass') recommendations.push('DKIM signature could not be verified');
    if (dmarc.status !== 'pass') recommendations.push('DMARC policy not properly configured');
    if (threats.some(t => t.type === 'phishing')) recommendations.push('Be cautious of requests for sensitive information');
    if (threats.some(t => t.type === 'suspicious-attachment')) recommendations.push('Do not open attachments from unknown senders');

    return {
      summary,
      scoreFactors,
      technicalDetails: {
        headers: {
          'From': email.headers.from.email,
          'To': email.headers.to.map(t => t.email).join(', '),
          'Subject': email.headers.subject,
          'Date': email.headers.date.toISOString(),
          'Message-ID': email.headers.messageId || 'N/A',
          'SPF': email.headers.spf || 'N/A',
          'DKIM': email.headers.dkim || 'N/A',
          'DMARC': email.headers.dmarc || 'N/A',
        },
        analysisTimestamp: new Date().toISOString(),
        analysisVersion: '1.0.0-prototype',
      },
      recommendations,
    };
  }
}

// Singleton instance for the prototype
export const analysisEngine = new HeuristicAnalysisEngine();
