/**
 * Geolocation service for analysis engine.
 *
 * Key design decisions:
 *  1. Private / reserved IPs are rejected immediately — no external request.
 *  2. Public IP results are cached in-process for the lifetime of the server
 *     (replaceable with Redis / DB later).
 *  3. External provider calls use a 3 s AbortController timeout so a
 *     provider failure never stalls the inbox for multiple seconds.
 *  4. Provider failure returns a structured "unavailable" result — the
 *     analysis continues and the email is NOT flagged as suspicious.
 *  5. A two-provider fallback chain is used: ip-api.com (primary) →
 *     ipapi.co (secondary).  If both fail, geo is "unavailable".
 *     No fabricated coordinates are ever returned.
 */

export interface GeolocationData {
  ip: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  region?: string;
  country: string;
  countryCode?: string;
  isp?: string;
  asn?: string;
  confidence: 'high' | 'medium' | 'low';
  approximate: boolean;
  /** Why the lookup was skipped, if applicable. */
  skipReason?: 'private_or_reserved_ip' | 'provider_unavailable' | 'no_provider';
}

export interface GeolocationProvider {
  name: string;
  locateIp(ip: string): Promise<GeolocationData | null>;
}

// ── IP classification ────────────────────────────────────────────────────────

/**
 * Returns true if `ip` is a publicly routable IPv4 address.
 * Blocks RFC 1918, loopback, link-local, broadcast, multicast, and reserved.
 */
export function isPublicIPv4(ip: string): boolean {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) return false;
  const [a, b] = parts;
  if (a === 10) return false;                         // 10.0.0.0/8
  if (a === 127) return false;                        // 127.0.0.0/8  loopback
  if (a === 172 && b >= 16 && b <= 31) return false;  // 172.16.0.0/12
  if (a === 192 && b === 168) return false;           // 192.168.0.0/16
  if (a === 169 && b === 254) return false;           // 169.254.0.0/16  link-local
  if (a === 0) return false;                          // 0.0.0.0/8
  if (a >= 224) return false;                        // multicast + reserved (224-255)
  return true;
}

/**
 * Returns true if `ip` is an IPv6 loopback, ULA, or link-local address
 * that should never be sent to an external geo provider.
 */
export function isPrivateIPv6(ip: string): boolean {
  const lower = ip.toLowerCase().trim();
  if (lower === '::1') return true;
  // ULA: fc00::/7  →  starts with fc or fd
  if (/^f[cd]/i.test(lower)) return true;
  // link-local: fe80::/10  →  starts with fe8, fe9, fea, feb
  if (/^fe[89ab]/i.test(lower)) return true;
  return false;
}

export function isPrivateOrReservedIP(ip: string): boolean {
  if (!ip || ip === 'unknown' || ip === 'Unavailable') return true;
  if (ip.includes(':')) return isPrivateIPv6(ip);
  return !isPublicIPv4(ip);
}

// ── In-process geo cache ─────────────────────────────────────────────────────

/**
 * Simple singleton map used as an in-process cache.
 * Keyed by IP address. An entry persists until the server process restarts.
 * Replace with Redis/KV in production for durability across deploys.
 */
const geoCache = new Map<string, GeolocationData>();

// ── Provider implementations ─────────────────────────────────────────────────

const GEO_TIMEOUT_MS = 3_000;

/**
 * Primary provider: ip-api.com (HTTP, free tier, no API key required).
 * Note: ip-api.com requires HTTP (not HTTPS) for the free tier.
 */
export class IpApiGeolocationProvider implements GeolocationProvider {
  name = 'ip-api.com';

  async locateIp(ip: string): Promise<GeolocationData | null> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), GEO_TIMEOUT_MS);

    try {
      const response = await fetch(
        `http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,regionName,city,lat,lon,isp,as`,
        { signal: controller.signal }
      );
      clearTimeout(timer);

      if (!response.ok) return null;
      const data = await response.json();
      if (data.status !== 'success') return null;

      return {
        ip,
        latitude: data.lat,
        longitude: data.lon,
        city: data.city,
        region: data.regionName,
        country: data.country,
        countryCode: data.countryCode,
        isp: data.isp,
        asn: data.as,
        confidence: 'high',
        approximate: false,
      };
    } catch {
      // AbortError (timeout) or network failure — treated as unavailable.
      clearTimeout(timer);
      return null;
    }
  }
}

/**
 * Secondary / fallback provider: ipapi.co (HTTPS, free tier, no API key).
 * Used when ip-api.com is unreachable (e.g. plain-HTTP blocked by network policy).
 *
 * Free tier rate limit: ~1,000 requests/day.
 * In production, replace with a paid provider (MaxMind, ip-api.com Pro, etc.)
 * and configure via environment variable.
 */
export class IpapiCoProvider implements GeolocationProvider {
  name = 'ipapi.co';

  async locateIp(ip: string): Promise<GeolocationData | null> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), GEO_TIMEOUT_MS);

    try {
      const response = await fetch(
        `https://ipapi.co/${ip}/json/`,
        {
          signal: controller.signal,
          // ipapi.co requires a User-Agent; using a neutral one avoids 403s
          headers: { 'User-Agent': 'cyber-leek-mailer/1.0' },
        }
      );
      clearTimeout(timer);

      if (!response.ok) return null;
      const data = await response.json();

      // ipapi.co signals errors via an "error" field
      if (data.error) return null;
      // Must have at least a country to be useful
      if (!data.country_name) return null;

      return {
        ip,
        latitude: typeof data.latitude === 'number' ? data.latitude : undefined,
        longitude: typeof data.longitude === 'number' ? data.longitude : undefined,
        city: data.city || undefined,
        region: data.region || undefined,
        country: data.country_name,
        countryCode: data.country_code || undefined,
        isp: data.org || undefined,
        asn: data.asn || undefined,
        confidence: 'high',
        approximate: false,
      };
    } catch {
      clearTimeout(timer);
      return null;
    }
  }
}

// ── GeolocationService ───────────────────────────────────────────────────────

export class GeolocationService {
  /** Ordered list of providers to try. First success wins. */
  private providers: GeolocationProvider[];

  /**
   * @param providers  Optional override of the provider chain.
   *                   Defaults to [IpApiGeolocationProvider, IpapiCoProvider].
   *                   Pass an empty array to disable all external lookups (useful
   *                   for unit tests that should not make network calls).
   */
  constructor(providers?: GeolocationProvider[]) {
    this.providers = providers ?? [
      new IpApiGeolocationProvider(),
      new IpapiCoProvider(),
    ];
  }

  async getGeolocation(ip: string | null): Promise<GeolocationData> {
    const unavailable = (skipReason: GeolocationData['skipReason']): GeolocationData => ({
      ip: ip ?? 'Unavailable',
      country: 'Unavailable',
      confidence: 'low',
      approximate: true,
      skipReason,
    });

    if (!ip || ip === 'Unavailable' || ip === 'unknown') {
      return unavailable('provider_unavailable');
    }

    // 1. Reject private / reserved IPs without any network call.
    if (isPrivateOrReservedIP(ip)) {
      return unavailable('private_or_reserved_ip');
    }

    // 2. Return cached result if available.
    const cached = geoCache.get(ip);
    if (cached) return cached;

    // 3. No providers configured.
    if (this.providers.length === 0) {
      return unavailable('no_provider');
    }

    // 4. Try each provider in order — first success wins.
    for (const provider of this.providers) {
      try {
        const data = await provider.locateIp(ip);
        if (data) {
          // 5. Cache and return.
          geoCache.set(ip, data);
          return data;
        }
      } catch {
        // Provider threw unexpectedly — continue to next.
      }
    }

    // All providers failed.
    return unavailable('provider_unavailable');
  }
}
