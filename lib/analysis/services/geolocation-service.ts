/**
 * Geolocation Service Interface
 * 
 * This service provides IP geolocation functionality.
 * The mock implementation can be replaced with real providers like MaxMind or IP2Location.
 */

export interface GeolocationResult {
  ip: string;
  latitude: number;
  longitude: number;
  city?: string;
  region?: string;
  country: string;
  isp?: string;
  asn?: string;
  confidence: 'high' | 'medium' | 'low';
  isApproximate: boolean;
}

export interface GeolocationService {
  getLocation(ip: string): Promise<GeolocationResult>;
  getLocationSync(ip: string): GeolocationResult;
}

/**
 * Mock Geolocation Service
 * 
 * Provides deterministic mock geolocation data for prototype testing.
 * Can be replaced with real MaxMind/IP2Location integration.
 */
export class MockGeolocationService implements GeolocationService {
  private mockDatabase: Record<string, GeolocationResult>;

  constructor() {
    this.mockDatabase = {
      '10.0.0.1': {
        ip: '10.0.0.1',
        latitude: 40.7128,
        longitude: -74.0060,
        city: 'New York',
        region: 'New York',
        country: 'United States',
        isp: 'Corporate Network',
        asn: 'AS15169',
        confidence: 'high',
        isApproximate: false,
      },
      '192.168.1.1': {
        ip: '192.168.1.1',
        latitude: 37.7749,
        longitude: -122.4194,
        city: 'San Francisco',
        region: 'California',
        country: 'United States',
        isp: 'Example ISP',
        asn: 'AS3356',
        confidence: 'high',
        isApproximate: false,
      },
      '203.0.113.1': {
        ip: '203.0.113.1',
        latitude: 55.7558,
        longitude: 37.6173,
        city: 'Moscow',
        region: 'Moscow',
        country: 'Russia',
        isp: 'Unknown ISP',
        asn: 'AS12345',
        confidence: 'medium',
        isApproximate: true,
      },
      '198.51.100.1': {
        ip: '198.51.100.1',
        latitude: 39.9042,
        longitude: 116.4074,
        city: 'Beijing',
        region: 'Beijing',
        country: 'China',
        isp: 'China Telecom',
        asn: 'AS4134',
        confidence: 'medium',
        isApproximate: true,
      },
      'unknown': {
        ip: 'unknown',
        latitude: 0,
        longitude: 0,
        country: 'Unknown',
        confidence: 'low',
        isApproximate: true,
      },
    };
  }

  async getLocation(ip: string): Promise<GeolocationResult> {
    // Simulate async API call
    return this.getLocationSync(ip);
  }

  getLocationSync(ip: string): GeolocationResult {
    return this.mockDatabase[ip] || this.mockDatabase['unknown'];
  }
}

// Singleton instance for the prototype
export const geolocationService = new MockGeolocationService();
