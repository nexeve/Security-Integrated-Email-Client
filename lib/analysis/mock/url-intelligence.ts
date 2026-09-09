import { URLIntelligenceItem, URLReputation } from '../../types';
import { RawEmail } from '../../types';

/**
 * Generate URL Intelligence
 * Mock implementation for prototype - can be replaced with real threat intelligence feeds
 */
export function generateURLIntelligence(email: RawEmail): URLIntelligenceItem[] {
  // Try to find URLs in text and html body
  const bodyMatches = email.body?.match(/https?:\/\/[^\s<"']+/g) || [];
  const htmlMatches = email.htmlBody?.match(/https?:\/\/[^\s<"']+/g) || [];
  const rawMatches = [...bodyMatches, ...htmlMatches];
  
  const urlMatches = Array.from(new Set(rawMatches)); // Deduplicate
  
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
      let riskScore = 0;
      let threatType: string | undefined;
      
      if (suspiciousDomains.some(d => domain === d || domain.endsWith('.' + d))) {
        reputation = 'malicious';
        riskScore = 85;
        threatType = 'Phishing / Credential Harvesting';
      } else if (domain === 'tech-promos.com' || domain.endsWith('.tech-promos.com')) {
        reputation = 'safe';
        riskScore = 15;
      } else if (domain === 'company.com' || domain.endsWith('.company.com')) {
        reputation = 'safe';
        riskScore = 10;
      } else {
        // Base score for unknown URLs
        riskScore = 20;

        // Context-aware heuristic analysis
        let isGoogleInfra = false;
        if (domain === 'google.com' || domain.endsWith('.google.com')) {
          isGoogleInfra = true;
        }

        // Long hostname is extremely suspicious
        if (domain.length > 60) {
          riskScore += 40;
          threatType = 'Suspicious Hostname Length';
        }
        
        // IP-based URLs are suspicious unless local
        const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(domain);
        if (isIp && !domain.startsWith('127.') && !domain.startsWith('10.') && !domain.startsWith('192.168.')) {
          riskScore += 30;
          threatType = 'IP-based URL';
        }
        
        // Deceptive domains (e.g. contains @ before hostname)
        // URL parser handles this natively (urlObj.username or password present means basic auth was used)
        if (urlObj.username || urlObj.password) {
          riskScore += 50;
          threatType = 'Deceptive Authentication (username in URL)';
        }
        
        // Check query strings
        const queryParams = Array.from(urlObj.searchParams.values());
        const hasNestedUrl = queryParams.some(val => val.startsWith('http://') || val.startsWith('https://'));
        
        // If it's a long URL but it's just a long query string, don't penalize as heavily
        // especially if it's a known safe provider like Google Accounts
        if (url.length > 150) {
          if (isGoogleInfra && hasNestedUrl) {
            // Likely a legitimate redirect/account chooser
            riskScore += 5;
          } else {
            riskScore += 15;
            if (!threatType) threatType = 'Excessive URL Length';
          }
        }
        
        // Determine final reputation bounds
        if (riskScore >= 70) {
          reputation = 'malicious';
        } else if (riskScore >= 40) {
          reputation = 'suspicious';
        } else if (riskScore <= 20) {
          reputation = 'safe';
        } else {
          reputation = 'unknown';
        }
      }

      const status = reputation === 'safe' ? 'Clean' : 
                    reputation === 'malicious' ? 'Known Threat' :
                    reputation === 'suspicious' ? 'Suspicious' : 'Unverified (No Intelligence Provider)';

      return {
        url,
        domain,
        reputation,
        status,
        threatType,
        firstSeen: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        lastSeen: new Date().toISOString(),
        riskScore: Math.min(riskScore, 100),
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
