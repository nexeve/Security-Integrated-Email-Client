import { OriginAnalysis, RelayHop } from '../../types';
import { RawEmail } from '../../types';
import { geolocationService, GeolocationResult } from '../services/geolocation-service';

/**
 * Generate Origin Analysis
 * Mock implementation for prototype - can be replaced with real IP analysis
 */
export function generateOriginAnalysis(email: RawEmail): OriginAnalysis {
  const senderIP = email.metadata?.ip || 'unknown';
  const senderDomain = email.headers.from.email.split('@')[1];
  const replyToDomain = email.headers.returnPath?.split('@')[1] || senderDomain;

  // Generate deterministic relay path based on email ID for consistency
  const emailIdNum = parseInt(email.id) || 1;
  const baseIP = senderIP === 'unknown' ? '203.0.113.1' : senderIP;
  
  if (email.metadata && 'isRealGmail' in email.metadata && (email.metadata as Record<string, unknown>).isRealGmail) {
    // For real Gmail messages, we don't invent relay hops.
    const realGeo = geolocationService.getLocationSync(senderIP);
    return {
      earliestReliableIP: senderIP !== 'unknown' ? senderIP : 'Unavailable',
      confidence: senderIP !== 'unknown' ? 'high' : 'low',
      senderDomain,
      replyToDomain,
      relayPath: [],
      earliestOrigin: {
        ip: senderIP !== 'unknown' ? senderIP : 'Unavailable',
        location: {
          country: realGeo.country,
          city: realGeo.city,
          region: realGeo.region,
        },
        provider: realGeo.isp,
      },
      totalHops: 0,
    };
  }

  // Create deterministic but varied relay paths based on email ID
  const relayPath: RelayHop[] = [];
  const baseLocations = [
    { country: 'United States', city: 'New York', region: 'California', lat: 40.7128, lng: -74.0060 },
    { country: 'Germany', city: 'Frankfurt', region: 'Hesse', lat: 50.1109, lng: 8.6821 },
    { country: 'Singapore', city: 'Singapore', region: '', lat: 1.3521, lng: 103.8198 },
    { country: 'Japan', city: 'Tokyo', region: 'Kanto', lat: 35.6762, lng: 139.6503 },
    { country: 'United Kingdom', city: 'London', region: 'England', lat: 51.5074, lng: -0.1278 },
  ];

  // Get geolocation for base IP
  const baseGeo = geolocationService.getLocationSync(baseIP);

  // Create relay hops
  for (let i = 0; i < 4; i++) {
    const hopIndex = (emailIdNum + i) % baseLocations.length;
    const location = baseLocations[hopIndex];
    const isOrigin = i === 0;
    
    const hopIP = isOrigin ? baseIP : `192.0.2.${((emailIdNum * 10 + i) % 254) + 1}`;
    const hopGeo = isOrigin ? baseGeo : {
      ip: hopIP,
      latitude: location.lat,
      longitude: location.lng,
      city: location.city,
      region: location.region,
      country: location.country,
      confidence: 'medium' as const,
      isApproximate: true,
    };

    relayPath.push({
      hopNumber: i + 1,
      ip: hopIP,
      hostname: isOrigin ? undefined : `relay-${i + 1}.example.com`,
      provider: isOrigin ? baseGeo.isp : ['Cloudflare', 'AWS', 'Google Cloud', 'Azure'][(emailIdNum + i) % 4],
      location: {
        country: hopGeo.country,
        city: hopGeo.city,
        region: hopGeo.region,
        latitude: hopGeo.latitude,
        longitude: hopGeo.longitude,
      },
      timestamp: new Date(Date.now() - (3 - i) * 60000).toISOString(),
      confidence: isOrigin ? 'high' : 'medium',
      role: isOrigin ? 'earliest_origin' : 'relay',
    });
  }

  // Determine earliest origin
  const earliestOrigin = {
    ip: baseIP,
    location: {
      country: baseGeo.country,
      city: baseGeo.city,
      region: baseGeo.region,
    },
    provider: baseGeo.isp,
  };

  return {
    earliestReliableIP: baseIP,
    confidence: baseGeo.confidence === 'high' ? 'high' : 'medium',
    senderDomain,
    replyToDomain,
    relayPath,
    earliestOrigin,
    totalHops: relayPath.length,
  };
}
