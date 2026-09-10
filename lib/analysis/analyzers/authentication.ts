import { RawEmail, SecurityCheckResult } from '../../types';

export interface AuthenticationFindings {
  spf: SecurityCheckResult;
  dkim: SecurityCheckResult;
  dmarc: SecurityCheckResult;
}

export function analyzeAuthentication(email: RawEmail): AuthenticationFindings {
  return {
    spf: parseAuthHeader(email.headers.spf, 'SPF', email.headers.from.email.split('@')[1]),
    dkim: parseAuthHeader(email.headers.dkim, 'DKIM', email.headers.from.email.split('@')[1]),
    dmarc: parseAuthHeader(email.headers.dmarc, 'DMARC', email.headers.from.email.split('@')[1])
  };
}

function parseAuthHeader(headerValue: string | undefined, type: string, domain: string): SecurityCheckResult {
  if (!headerValue || headerValue === 'unknown') {
    return {
      status: 'unknown',
      details: `${type} evaluation unavailable or header missing`,
      domain
    };
  }

  const val = headerValue.toLowerCase();
  
  if (val.includes('pass')) {
    return {
      status: 'pass',
      details: `${type} verification passed`,
      domain
    };
  }
  
  if (val.includes('fail') || val.includes('softfail')) {
    return {
      status: 'fail',
      details: `${type} verification failed`,
      domain
    };
  }
  
  if (val.includes('neutral') || val.includes('none')) {
    return {
      status: 'neutral',
      details: `${type} verification neutral or none`,
      domain
    };
  }
  
  return {
    status: 'unknown',
    details: `${type} evaluation unavailable`,
    domain
  };
}
