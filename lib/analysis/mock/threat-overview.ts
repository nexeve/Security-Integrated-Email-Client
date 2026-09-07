import { ThreatOverview, RiskLevel, Verdict, AttackType, PhishingClassification } from '../../types';
import { RawEmail, ThreatIndicator } from '../../types';

/**
 * Generate Threat Overview
 * Mock implementation for prototype - can be replaced with real ML analysis
 */
export function generateThreatOverview(
  email: RawEmail,
  safetyScore: number,
  threatIndicators: ThreatIndicator[]
): ThreatOverview {
  // Determine risk level based on safety score
  let riskLevel: RiskLevel;
  if (safetyScore >= 90) riskLevel = 'safe';
  else if (safetyScore >= 75) riskLevel = 'low';
  else if (safetyScore >= 50) riskLevel = 'medium';
  else if (safetyScore >= 25) riskLevel = 'high';
  else riskLevel = 'critical';

  // Determine verdict based on risk and threats
  let verdict: Verdict;
  if (riskLevel === 'safe' || riskLevel === 'low') verdict = 'safe';
  else if (riskLevel === 'medium') verdict = 'likely_safe';
  else if (riskLevel === 'high') verdict = 'caution';
  else verdict = 'suspicious';

  // Override verdict if critical threats present
  const hasCriticalThreats = threatIndicators.some(t => t.severity === 'critical');
  if (hasCriticalThreats) verdict = 'malicious';

  // Determine attack type based on threat indicators
  let attackType: AttackType = 'none';
  if (threatIndicators.some(t => t.type === 'phishing')) attackType = 'phishing';
  else if (threatIndicators.some(t => t.type === 'impersonation')) attackType = 'business_email_compromise';
  else if (threatIndicators.some(t => t.type === 'spoofing')) attackType = 'spoofing';
  else if (threatIndicators.some(t => t.type === 'suspicious-attachment')) attackType = 'malware';
  else if (threatIndicators.some(t => t.type.includes('language'))) attackType = 'social_engineering';

  // Determine phishing classification
  let phishingClassification: PhishingClassification = 'none';
  const body = email.body.toLowerCase();
  if (body.includes('password') || body.includes('login') || body.includes('verify')) {
    phishingClassification = 'credential_harvesting';
  } else if (body.includes('invoice') || body.includes('payment')) {
    phishingClassification = 'fake_invoice';
  } else if (body.includes('support') || body.includes('help')) {
    phishingClassification = 'tech_support';
  } else if (email.headers.from.name.toLowerCase().includes('ceo') || 
             email.headers.from.name.toLowerCase().includes('president')) {
    phishingClassification = 'ceo_fraud';
  } else if (body.includes('account') && body.includes('verify')) {
    phishingClassification = 'account_verification';
  }

  // Check for social engineering indicators
  const socialEngineeringIndicators = [
    'urgent', 'immediate', 'action required', 'suspended', 'verify',
    'confidential', 'secret', 'wire transfer', 'payment', 'account'
  ];
  const socialEngineeringDetected = socialEngineeringIndicators.some(indicator =>
    body.includes(indicator) || email.headers.subject.toLowerCase().includes(indicator)
  );

  // Count URLs (mock - in production would parse actual URLs)
  const urlMatches = email.body.match(/https?:\/\/[^\s]+/g);
  const urlCount = urlMatches ? urlMatches.length : 0;

  // Count attachments
  const attachmentCount = email.attachments?.length || 0;

  // Confidence based on security check results
  const spfPass = email.headers.spf?.includes('pass');
  const dkimPass = email.headers.dkim?.includes('pass');
  const dmarcPass = email.headers.dmarc?.includes('pass');
  const authPassCount = [spfPass, dkimPass, dmarcPass].filter(Boolean).length;
  const confidence = Math.round((authPassCount / 3) * 100);

  return {
    riskLevel,
    confidence,
    safetyScore,
    verdict,
    attackType,
    phishingClassification,
    socialEngineeringDetected,
    urlCount,
    attachmentCount,
    threatIndicatorCount: threatIndicators.length,
    reputationCheckCount: 1, // Mock - would be real checks in production
  };
}
