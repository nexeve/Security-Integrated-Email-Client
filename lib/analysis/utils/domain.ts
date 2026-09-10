/**
 * A simple heuristic organizational domain extractor.
 * In a real-world scenario, this should use the Public Suffix List (e.g. psl package).
 * For this prototype, we'll use a basic heuristic to strip common subdomains
 * and handle common two-part tlds like .co.uk.
 */

const TWO_PART_TLDS = new Set([
  'co.uk', 'co.jp', 'com.au', 'com.br', 'ac.uk', 'gov.uk',
  'go.jp', 'ne.jp', 'or.jp', 'ac.jp', 'ed.jp', 'lg.jp',
  'org.uk', 'net.uk', 'sch.uk', 'me.uk', 
  'net.au', 'org.au', 'edu.au', 'gov.au', 'asn.au',
  'co.nz', 'net.nz', 'org.nz', 'geek.nz', 'kiwi.nz',
  'co.za', 'net.za', 'org.za', 'edu.za', 'gov.za',
  'co.in', 'net.in', 'org.in', 'edu.in', 'gov.in', 'firm.in',
  'com.cn', 'net.cn', 'org.cn', 'edu.cn', 'gov.cn',
  'com.sg', 'net.sg', 'org.sg', 'edu.sg', 'gov.sg',
  'com.my', 'net.my', 'org.my', 'edu.my', 'gov.my'
]);

export function getOrganizationalDomain(hostname: string): string {
  if (!hostname) return '';
  const parts = hostname.toLowerCase().trim().split('.');
  
  if (parts.length <= 2) {
    return hostname.toLowerCase().trim();
  }

  // Check if the last two parts form a known two-part TLD
  const lastTwo = `${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
  if (TWO_PART_TLDS.has(lastTwo)) {
    if (parts.length > 2) {
      return `${parts[parts.length - 3]}.${lastTwo}`;
    }
    return hostname.toLowerCase().trim();
  }

  // Standard fallback: assume the last two parts are the organizational domain
  return `${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
}
