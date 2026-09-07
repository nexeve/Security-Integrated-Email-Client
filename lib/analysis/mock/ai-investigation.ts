import { AIInvestigation } from '../../types';
import { RawEmail, ThreatIndicator } from '../../types';

/**
 * Generate AI Investigation
 * Mock implementation for prototype - can be replaced with real LLM analysis
 */
export function generateAIInvestigation(
  email: RawEmail,
  threatIndicators: ThreatIndicator[],
  safetyScore: number
): AIInvestigation {
  const body = email.body.toLowerCase();
  const subject = email.headers.subject.toLowerCase();
  
  // Generate executive assessment based on safety score and threats
  let executiveAssessment = '';
  if (safetyScore >= 80) {
    executiveAssessment = 'This email demonstrates strong security indicators with proper authentication and no significant threat patterns. The content appears to be legitimate business communication with standard formatting and expected behavior.';
  } else if (safetyScore >= 50) {
    executiveAssessment = 'This email shows moderate security concerns. While some authentication mechanisms are in place, there are indicators that warrant additional review. The content contains elements that are commonly associated with both legitimate and suspicious communications.';
  } else {
    executiveAssessment = 'This email exhibits multiple high-risk indicators consistent with advanced social engineering and phishing campaigns. The combination of authentication failures, urgency language, and suspicious patterns suggests a coordinated attack attempt.';
  }

  // Generate key evidence based on threat indicators
  const keyEvidence: string[] = [];
  
  const spfEvidence = email.headers.spf?.includes('pass') ? 
    'SPF authentication passed - sender IP is authorized' :
    'SPF authentication failed - sender IP not authorized for domain';
  keyEvidence.push(spfEvidence);

  const dkimEvidence = email.headers.dkim?.includes('pass') ?
    'DKIM signature verified - message integrity confirmed' :
    'DKIM signature verification failed - message may be tampered';
  keyEvidence.push(dkimEvidence);

  if (threatIndicators.some(t => t.type === 'phishing')) {
    keyEvidence.push('Phishing patterns detected in email content');
  }
  if (threatIndicators.some(t => t.type === 'spoofing')) {
    keyEvidence.push('Domain spoofing indicators present');
  }
  if (threatIndicators.some(t => t.type === 'impersonation')) {
    keyEvidence.push('Executive impersonation attempt detected');
  }
  if (body.includes('urgent') || subject.includes('urgent')) {
    keyEvidence.push('Urgency language detected - common social engineering tactic');
  }
  if (email.attachments && email.attachments.length > 0) {
    keyEvidence.push(`Email contains ${email.attachments.length} attachment(s) - additional caution advised`);
  }

  // Generate social engineering indicators
  const socialEngineeringIndicators: string[] = [];
  const sePatterns = [
    { pattern: 'urgent', indicator: 'Urgency language to pressure immediate action' },
    { pattern: 'verify', indicator: 'Account verification request' },
    { pattern: 'password', indicator: 'Credential-related language' },
    { pattern: 'suspended', indicator: 'Account suspension threat' },
    { pattern: 'confidential', indicator: 'Confidentiality appeal' },
    { pattern: 'wire transfer', indicator: 'Financial transaction request' },
    { pattern: 'ceo', indicator: 'Executive authority invocation' },
    { pattern: 'immediate', indicator: 'Immediate action requirement' },
  ];

  sePatterns.forEach(({ pattern, indicator }) => {
    if (body.includes(pattern) || subject.includes(pattern)) {
      socialEngineeringIndicators.push(indicator);
    }
  });

  // Generate recommended actions
  const recommendedActions: string[] = [];
  
  if (safetyScore < 50) {
    recommendedActions.push('Do not click any links or download attachments');
    recommendedActions.push('Verify sender identity through alternative channel');
    recommendedActions.push('Report to security team');
  }
  
  if (threatIndicators.some(t => t.type === 'phishing')) {
    recommendedActions.push('Treat as potential phishing attempt');
  }
  
  if (email.headers.spf?.includes('fail')) {
    recommendedActions.push('SPF failure indicates potential spoofing');
  }
  
  if (safetyScore >= 80) {
    recommendedActions.push('Email appears safe - standard business communication');
  } else if (safetyScore >= 50) {
    recommendedActions.push('Review with caution before taking action');
  }

  // Calculate confidence based on data quality
  const hasAuthData = !!(email.headers.spf || email.headers.dkim || email.headers.dmarc);
  const hasMetadata = !!(email.metadata?.ip);
  const confidence = Math.round(
    (hasAuthData ? 30 : 0) + 
    (hasMetadata ? 20 : 0) + 
    (threatIndicators.length > 0 ? 30 : 0) + 
    20
  );

  return {
    executiveAssessment,
    keyEvidence,
    socialEngineeringIndicators,
    recommendedActions,
    confidence,
    analysisTimestamp: new Date().toISOString(),
  };
}
