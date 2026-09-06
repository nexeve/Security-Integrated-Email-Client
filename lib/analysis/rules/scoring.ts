import { RawEmail, SecurityCheckResult, ThreatIndicator, ScoreFactor, EmailCategory } from '../../types';

/**
 * Calculate Safety Score Factors
 * Returns array of factors that impact the safety score
 */
export function calculateSafetyScore(
  email: RawEmail,
  spf: SecurityCheckResult,
  dkim: SecurityCheckResult,
  dmarc: SecurityCheckResult,
  threats: ThreatIndicator[]
): ScoreFactor[] {
  const factors: ScoreFactor[] = [];
  
  // Security check impacts
  if (spf.status === 'pass') {
    factors.push({
      factor: 'SPF Authentication',
      impact: 10,
      description: 'SPF verification passed - sender is authorized',
    });
  } else if (spf.status === 'fail') {
    factors.push({
      factor: 'SPF Authentication',
      impact: -25,
      description: 'SPF verification failed - sender may be spoofed',
    });
  } else {
    factors.push({
      factor: 'SPF Authentication',
      impact: -5,
      description: 'SPF record not found or inconclusive',
    });
  }
  
  if (dkim.status === 'pass') {
    factors.push({
      factor: 'DKIM Signature',
      impact: 10,
      description: 'DKIM signature verified - message integrity confirmed',
    });
  } else if (dkim.status === 'fail') {
    factors.push({
      factor: 'DKIM Signature',
      impact: -20,
      description: 'DKIM signature verification failed',
    });
  } else {
    factors.push({
      factor: 'DKIM Signature',
      impact: -5,
      description: 'DKIM signature not present',
    });
  }
  
  if (dmarc.status === 'pass') {
    factors.push({
      factor: 'DMARC Policy',
      impact: 10,
      description: 'DMARC policy satisfied - domain authenticated',
    });
  } else if (dmarc.status === 'fail') {
    factors.push({
      factor: 'DMARC Policy',
      impact: -20,
      description: 'DMARC policy failed',
    });
  } else {
    factors.push({
      factor: 'DMARC Policy',
      impact: -5,
      description: 'DMARC policy not found',
    });
  }
  
  // Threat indicator impacts
  threats.forEach(threat => {
    let impact = 0;
    switch (threat.severity) {
      case 'critical':
        impact = -30;
        break;
      case 'high':
        impact = -20;
        break;
      case 'medium':
        impact = -10;
        break;
      case 'low':
        impact = -5;
        break;
    }
    
    factors.push({
      factor: `Threat: ${threat.type}`,
      impact,
      description: threat.description,
    });
  });
  
  // Attachment impact
  if (email.attachments && email.attachments.length > 0) {
    factors.push({
      factor: 'Attachments',
      impact: -5,
      description: 'Email contains attachments - additional caution advised',
    });
  }
  
  return factors;
}

/**
 * Determine Email Category based on safety score and threats
 */
export function determineCategory(
  safetyScore: number,
  threats: ThreatIndicator[]
): EmailCategory {
  const hasCriticalThreats = threats.some(t => t.severity === 'critical');
  const hasHighThreats = threats.some(t => t.severity === 'high');
  
  if (hasCriticalThreats || (hasHighThreats && safetyScore < 30)) {
    return 'malicious';
  }
  
  if (hasHighThreats || safetyScore < 50) {
    return 'suspicious';
  }
  
  if (safetyScore < 60) {
    return 'spam';
  }
  
  if (safetyScore < 85) {
    return 'promotional';
  }
  
  return 'normal';
}
