import { RawEmail, ThreatIndicator } from '../../types';
import { getOrganizationalDomain } from '../utils/domain';

export function analyzeIdentity(email: RawEmail): ThreatIndicator[] {
  const indicators: ThreatIndicator[] = [];
  
  const fromAddress = email.headers.from.email.toLowerCase();
  const fromDomain = fromAddress.split('@')[1];
  if (!fromDomain) return indicators;

  const fromOrgDomain = getOrganizationalDomain(fromDomain);
  
  // Reply-To mismatch
  const replyTo = email.headers.replyTo?.toLowerCase();
  if (replyTo && replyTo !== fromAddress) {
    // Some replyTo headers might contain full names, so we just extract the email part.
    // For simplicity, we assume replyTo is just the email here if it was normalized, or we extract it.
    // Let's rely on basic splitting, assuming replyTo is an email address.
    const replyToMatch = replyTo.match(/<([^>]+)>/) || [null, replyTo];
    const replyToEmail = replyToMatch[1]?.trim();
    if (replyToEmail) {
      const replyToDomain = replyToEmail.split('@')[1];
      if (replyToDomain) {
        const replyToOrgDomain = getOrganizationalDomain(replyToDomain);
        if (fromOrgDomain !== replyToOrgDomain) {
          indicators.push({
            id: 'CROSS_ORG_REPLY_TO',
            category: 'spoofing',
            severity: 'medium',
            confidence: 'high',
            title: 'Cross-Organizational Reply-To Mismatch',
            explanation: 'The Reply-To domain belongs to a different organization than the From domain.',
            evidence: `From: ${fromDomain}, Reply-To: ${replyToDomain}`,
            source: 'identity-analyzer',
            contributesToRisk: true
          });
        }
      }
    }
  }

  // Return-Path check (Bounces)
  const returnPath = email.headers.returnPath?.toLowerCase();
  if (returnPath) {
    const returnPathMatch = returnPath.match(/<([^>]+)>/) || [null, returnPath];
    const returnPathEmail = returnPathMatch[1]?.trim();
    if (returnPathEmail) {
      const returnPathDomain = returnPathEmail.split('@')[1];
      if (returnPathDomain) {
        const returnPathOrgDomain = getOrganizationalDomain(returnPathDomain);
        if (fromOrgDomain !== returnPathOrgDomain) {
          indicators.push({
            id: 'CROSS_ORG_RETURN_PATH',
            category: 'spoofing',
            severity: 'low',
            confidence: 'medium',
            title: 'Cross-Organizational Return-Path Mismatch',
            explanation: 'The Return-Path (bounce) domain differs from the From organization. This can happen with third-party mailers (e.g. SendGrid), but may warrant inspection.',
            evidence: `From: ${fromDomain}, Return-Path: ${returnPathDomain}`,
            source: 'identity-analyzer',
            contributesToRisk: false // Frequently legitimate (e.g., MailChimp, AWS SES)
          });
        }
      }
    }
  }

  // Deceptive constructions (e.g. google.com.attacker.com)
  if (fromDomain.includes('.com.') || fromDomain.includes('.org.') || fromDomain.includes('.net.')) {
    indicators.push({
      id: 'DECEPTIVE_DOMAIN_CONSTRUCTION',
      category: 'spoofing',
      severity: 'high',
      confidence: 'high',
      title: 'Deceptive Domain Construction',
      explanation: 'The sender domain appears to be constructed to trick users into trusting it by prepending a known TLD pattern.',
      evidence: `Domain: ${fromDomain}`,
      source: 'identity-analyzer',
      contributesToRisk: true
    });
  }
  
  // Lookalike detection (basic prototype)
  // We avoid a giant hardcoded list but check common patterns for demonstration
  const commonOrgs = ['gmail.com', 'yahoo.com', 'microsoft.com', 'apple.com'];
  if (!commonOrgs.includes(fromOrgDomain)) {
    for (const org of commonOrgs) {
      if (fromOrgDomain.includes(org.replace('.com', ''))) {
        // Very basic substring match check for lookalikes (e.g. gmail-support.com)
        indicators.push({
          id: 'POSSIBLE_LOOKALIKE_DOMAIN',
          category: 'spoofing',
          severity: 'low',
          confidence: 'low',
          title: 'Possible Lookalike Domain',
          explanation: 'The sender domain resembles a common brand but does not match their official organizational domain.',
          evidence: `Domain: ${fromDomain} resembles ${org}`,
          source: 'identity-analyzer',
          contributesToRisk: true
        });
        break;
      }
    }
  }

  return indicators;
}
