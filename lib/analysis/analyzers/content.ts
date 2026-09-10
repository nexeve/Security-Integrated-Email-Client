import { RawEmail, ThreatIndicator } from '../../types';

export function analyzeContent(email: RawEmail): ThreatIndicator[] {
  const indicators: ThreatIndicator[] = [];
  const body = email.body.toLowerCase();
  const subject = email.headers.subject.toLowerCase();
  const htmlBody = email.htmlBody?.toLowerCase() || '';
  
  const combinedText = body + ' ' + subject + ' ' + htmlBody;

  // Weak signals
  const hasUrgency = /\b(urgent|immediate|action required|suspended|close.*account|delete.*account)\b/.test(combinedText);
  const hasCredentialRequest = /\b(password|credential|otp|login|sign in|verify your account)\b/.test(combinedText);
  const hasExternalLink = combinedText.includes('http://') || combinedText.includes('https://');
  
  if (hasUrgency && !hasCredentialRequest && !hasExternalLink) {
    indicators.push({
      id: 'URGENT_LANGUAGE',
      category: 'social_engineering',
      severity: 'low',
      confidence: 'low',
      title: 'Urgent Language Detected',
      explanation: 'Email contains urgency language, a common social engineering tactic, but no direct request for credentials.',
      evidence: 'Detected keywords indicating urgency.',
      source: 'content-analyzer',
      contributesToRisk: true
    });
  }

  if (hasUrgency && hasCredentialRequest && hasExternalLink) {
    indicators.push({
      id: 'CREDENTIAL_HARVESTING_BEHAVIOR',
      category: 'phishing',
      severity: 'high',
      confidence: 'medium',
      title: 'Suspicious Credential Request',
      explanation: 'Email combines urgent language with a request for credentials and external links.',
      evidence: 'Combination of urgency, credential requests, and external links detected.',
      source: 'content-analyzer',
      contributesToRisk: true
    });
  } else if (hasCredentialRequest && hasExternalLink) {
    indicators.push({
      id: 'EXTERNAL_LOGIN_PROMPT',
      category: 'phishing',
      severity: 'medium',
      confidence: 'low',
      title: 'External Login Prompt',
      explanation: 'Email asks the user to follow an external link to log in or verify credentials.',
      evidence: 'Credential request accompanied by external links.',
      source: 'content-analyzer',
      contributesToRisk: true
    });
  }

  // Look for suspicious hidden text or excessive styling
  if (htmlBody) {
    const hiddenTextMatch = htmlBody.match(/display:\s*none/g);
    if (hiddenTextMatch && hiddenTextMatch.length > 2) {
      indicators.push({
        id: 'HIDDEN_TEXT_DETECTED',
        category: 'evasion',
        severity: 'medium',
        confidence: 'medium',
        title: 'Hidden Text Detected',
        explanation: 'The email HTML contains multiple hidden elements, a technique often used to evade spam filters.',
        evidence: 'Detected "display: none" usage.',
        source: 'content-analyzer',
        contributesToRisk: true
      });
    }
  }

  return indicators;
}
