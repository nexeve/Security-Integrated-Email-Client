import { URLIntelligenceItem, URLReputation } from '../../types';
import { RawEmail } from '../../types';

/**
 * Generate URL Intelligence
 * Mock implementation for prototype - can be replaced with real threat intelligence feeds
 */
export function generateURLIntelligence(email: RawEmail): URLIntelligenceItem[] {
  const urlMatches = email.body.match(/https?:\/\/[^\s]+/g) || [];
  
  // Suspicious domains for mock reputation
  const suspiciousDomains = [
    'bit.ly', 'tinyurl.com', 'goo.gl', 't.co',
    'evil-domain.com', 'spoofed.com', 'phishing-site.com',
    'amazonn-secure.com', 'gma1l.com'
  ] as const;

  return urlMatches.map((url) => {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname;
      
      // Determine reputation (mock logic)
      let reputation: URLReputation = 'unknown';
      let riskScore = 50;
      let threatType: string | undefined;
      
      if (suspiciousDomains.some(d => domain.includes(d))) {
        reputation = 'malicious';
        riskScore = 85;
        threatType = 'Phishing / Credential Harvesting';
      } else if (domain.includes('tech-promos.com')) {
        reputation = 'safe';
        riskScore = 15;
        threatType = 'Legitimate Marketing';
      } else if (domain.includes('company.com')) {
        reputation = 'safe';
        riskScore = 10;
      } else if (url.length > 100) {
        reputation = 'suspicious';
        riskScore = 60;
        threatType = 'Suspicious URL Length';
      }

      const status = reputation === 'safe' ? 'Clean' : 
                    reputation === 'malicious' ? 'Known Threat' :
                    reputation === 'suspicious' ? 'Suspicious' : 'Unknown';

      return {
        url,
        domain,
        reputation,
        status,
        threatType,
        firstSeen: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        lastSeen: new Date().toISOString(),
        riskScore,
      };
    } catch {
      return {
        url,
        domain: 'invalid',
        reputation: 'unknown',
        status: 'Invalid URL',
        riskScore: 50,
      };
    }
  });
}
