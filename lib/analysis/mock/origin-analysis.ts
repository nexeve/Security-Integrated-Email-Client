import { OriginAnalysis, RelayHop } from '../../types';
import { RawEmail } from '../../types';

/**
 * Generate Origin Analysis
 * Mock implementation for prototype - can be replaced with real IP analysis
 */
export function generateOriginAnalysis(email: RawEmail): OriginAnalysis {
  const senderIP = email.metadata?.ip || 'unknown';
  const senderDomain = email.headers.from.email.split('@')[1];
  const replyToDomain = email.headers.returnPath?.split('@')[1] || senderDomain;

  // Mock relay path generation
  const relayPath: RelayHop[] = [];
  const baseIP = senderIP === 'unknown' ? '203.0.113.1' : senderIP;
  
  // Generate mock relay hops
  const locations = [
    { country: 'United States', city: 'San Francisco', region: 'California' },
    { country: 'Germany', city: 'Frankfurt', region: 'Hesse' },
    { country: 'Singapore', city: 'Singapore', region: '' },
    { country: 'Unknown', city: undefined, region: undefined },
  ];

  for (let i = 0; i < 4; i++) {
    relayPath.push({
      hopNumber: i + 1,
      ip: i === 0 ? baseIP : `192.0.2.${10 + i}`,
      hostname: i === 0 ? undefined : `relay-${i + 1}.example.com`,
      provider: i === 0 ? 'Original Sender' : ['Cloudflare', 'AWS', 'Google Cloud'][i % 3],
      location: locations[i],
      timestamp: new Date(Date.now() - (3 - i) * 60000).toISOString(),
      confidence: i === 0 ? 'high' : 'medium',
    });
  }

  // Determine earliest origin
  const earliestOrigin = {
    ip: baseIP,
    location: locations[0],
    provider: relayPath[0].provider,
  };

  return {
    earliestReliableIP: baseIP,
    confidence: 'medium',
    senderDomain,
    replyToDomain,
    relayPath,
    earliestOrigin,
    totalHops: relayPath.length,
  };
}
