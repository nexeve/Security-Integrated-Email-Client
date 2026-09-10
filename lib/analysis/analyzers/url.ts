import { RawEmail, ThreatIndicator } from '../../types';

export function analyzeUrls(email: RawEmail): ThreatIndicator[] {
  const indicators: ThreatIndicator[] = [];
  const combinedText = email.body + ' ' + (email.htmlBody || '');
  
  // Basic URL extraction
  const urlRegex = /(https?:\/\/[^\s<"']+)/g;
  const urls = Array.from(new Set((combinedText.match(urlRegex) || []).map(url => {
    const cleanUrl = url.replace(/[.,;!]+$/, '');
    try {
      return decodeURIComponent(cleanUrl);
    } catch {
      return cleanUrl;
    }
  })));
  
  const parsedUrls = urls.map(urlStr => {
    try {
      return new URL(urlStr);
    } catch {
      return null;
    }
  }).filter(Boolean) as URL[];

  const uniqueDomains = new Set<string>();

  for (const url of parsedUrls) {
    uniqueDomains.add(url.hostname.toLowerCase());
    
    // Check for IP-based URLs
    const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(url.hostname);
    if (isIp) {
      indicators.push({
        id: 'IP_BASED_URL',
        category: 'phishing',
        severity: 'high',
        confidence: 'high',
        title: 'IP-Based URL Detected',
        explanation: 'The email contains a URL that uses a raw IP address instead of a domain name, a common phishing tactic.',
        evidence: `URL: ${url.href}`,
        source: 'url-analyzer',
        contributesToRisk: true
      });
    }

    // Check for deceptive URL constructions in hostname
    if (url.hostname.includes('.com.') || url.hostname.includes('.org.')) {
      indicators.push({
        id: 'DECEPTIVE_URL_CONSTRUCTION',
        category: 'phishing',
        severity: 'medium',
        confidence: 'medium',
        title: 'Deceptive URL Construction',
        explanation: 'A URL hostname is constructed to appear as a different domain.',
        evidence: `Hostname: ${url.hostname}`,
        source: 'url-analyzer',
        contributesToRisk: true
      });
    }

    // Check for credentials in URL
    if (url.username || url.password) {
      indicators.push({
        id: 'CREDENTIALS_IN_URL',
        category: 'phishing',
        severity: 'critical',
        confidence: 'high',
        title: 'Credentials in URL',
        explanation: 'A URL contains embedded credentials, which is highly unusual and often indicates a malicious link.',
        evidence: `URL contains embedded credentials`,
        source: 'url-analyzer',
        contributesToRisk: true
      });
    }
  }

  // Additional cross-domain analysis can be implemented here later.
  return indicators;
}
