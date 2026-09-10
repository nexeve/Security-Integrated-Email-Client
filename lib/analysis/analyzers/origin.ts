import { RawEmail, ThreatIndicator } from '../../types';

export interface OriginFindings {
  relayIps: string[];
  earliestReliableIp: string | null;
  indicators: ThreatIndicator[];
}

function isPublicIp(ip: string): boolean {
  if (!ip) return false;
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some(isNaN)) return false;

  const [p1, p2] = parts;
  if (p1 === 10) return false;
  if (p1 === 127) return false;
  if (p1 === 192 && p2 === 168) return false;
  if (p1 === 172 && p2 >= 16 && p2 <= 31) return false;
  if (p1 === 169 && p2 === 254) return false;
  if (p1 === 0 || p1 >= 224) return false;

  return true;
}

export function analyzeOrigin(email: RawEmail): OriginFindings {
  const indicators: ThreatIndicator[] = [];
  const relayIps: string[] = [];
  
  if (email.headers.received) {
    for (const received of email.headers.received) {
      // Basic regex to extract IPv4
      const ipMatch = received.match(/(?:\[|\b)(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?:\]|\b)/);
      if (ipMatch) {
        relayIps.push(ipMatch[1]);
      }
    }
  }

  // If no IPs found in Received, fallback to metadata.ip
  if (relayIps.length === 0 && email.metadata?.ip && email.metadata.ip !== 'unknown') {
    relayIps.push(email.metadata.ip);
  }

  const publicRelays = relayIps.filter(isPublicIp);
  const earliestReliableIp = publicRelays.length > 0 ? publicRelays[publicRelays.length - 1] : null;

  return {
    relayIps,
    earliestReliableIp,
    indicators
  };
}
