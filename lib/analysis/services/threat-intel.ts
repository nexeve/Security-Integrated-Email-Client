import { URLIntelligenceItem } from '../../types';

export interface ThreatIntelProvider {
  name: string;
  checkUrl(urlStr: string): Promise<URLIntelligenceItem>;
}

export class VoidThreatIntelProvider implements ThreatIntelProvider {
  name = 'Unavailable';

  async checkUrl(urlStr: string): Promise<URLIntelligenceItem> {
    let hostname = 'Unknown';
    try {
      hostname = new URL(urlStr).hostname;
    } catch {}

    return {
      url: urlStr,
      domain: hostname,
      reputation: 'unknown',
      status: 'unverified',
      riskScore: 0,
      threatType: 'none',
      lastSeen: 'Unavailable',
      provider: this.name,
      providerStatus: 'unavailable',
    };
  }
}

export class GoogleSafeBrowsingProvider implements ThreatIntelProvider {
  name = 'Google Safe Browsing';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async checkUrl(urlStr: string): Promise<URLIntelligenceItem> {
    let hostname = 'Unknown';
    try {
      hostname = new URL(urlStr).hostname;
    } catch {}

    try {
      // In a real implementation, we would call the actual Google Safe Browsing API here
      // e.g., POST https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${this.apiKey}
      
      // Since this is a production skeleton without actual credentials returning data,
      // we must fallback to unknown if the API fails or if we are not actually calling it yet.
      return {
        url: urlStr,
        domain: hostname,
        reputation: 'unknown',
        status: 'unverified',
        riskScore: 0,
        threatType: 'none',
        lastSeen: 'Unavailable',
        provider: this.name,
        providerStatus: 'configured_but_untested',
      };
    } catch {
      return {
        url: urlStr,
        domain: hostname,
        reputation: 'unknown',
        status: 'error',
        riskScore: 0,
        threatType: 'none',
        lastSeen: 'Unavailable',
        provider: this.name,
        providerStatus: 'error',
      };
    }
  }
}

export function getThreatIntelProvider(): ThreatIntelProvider {
  const apiKey = process.env.SAFE_BROWSING_API_KEY;
  if (apiKey) {
    return new GoogleSafeBrowsingProvider(apiKey);
  }
  return new VoidThreatIntelProvider();
}
