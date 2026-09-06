import { GeolocationInfo } from '../../types';

/**
 * Mock Geolocation Data
 * 
 * For the prototype, we use hardcoded IP-to-location mappings.
 * In production, this would be replaced with a real geolocation API.
 */
const mockGeolocationDB: Record<string, GeolocationInfo> = {
  '192.168.1.1': {
    country: 'United States',
    city: 'San Francisco',
    region: 'California',
    ip: '192.168.1.1',
    isp: 'Example ISP',
    accuracy: 'high',
  },
  '10.0.0.1': {
    country: 'United States',
    city: 'New York',
    region: 'New York',
    ip: '10.0.0.1',
    isp: 'Corporate Network',
    accuracy: 'high',
  },
  '203.0.113.1': {
    country: 'Russia',
    city: 'Moscow',
    region: 'Moscow',
    ip: '203.0.113.1',
    isp: 'Unknown ISP',
    accuracy: 'medium',
  },
  '198.51.100.1': {
    country: 'China',
    city: 'Beijing',
    region: 'Beijing',
    ip: '198.51.100.1',
    isp: 'China Telecom',
    accuracy: 'medium',
  },
  'unknown': {
    country: 'Unknown',
    ip: 'unknown',
    accuracy: 'low',
  },
};

export function getGeolocation(ip: string): GeolocationInfo {
  return mockGeolocationDB[ip] || mockGeolocationDB['unknown'];
}
