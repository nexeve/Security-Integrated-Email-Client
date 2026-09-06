import { RawEmail, ThreatIndicator } from '../../types';

/**
 * Phishing Detection
 * Heuristic rules to detect potential phishing attempts
 */
export function detectPhishing(email: RawEmail): ThreatIndicator[] {
  const indicators: ThreatIndicator[] = [];
  const body = email.body.toLowerCase();
  const subject = email.headers.subject.toLowerCase();
  
  // Urgent language patterns
  const urgentPatterns = [
    'urgent', 'immediate action required', 'account suspended',
    'verify your identity', 'confirm your account', 'security alert',
    'unusual activity', 'your account will be closed'
  ];
  
  const hasUrgentLanguage = urgentPatterns.some(pattern => 
    body.includes(pattern) || subject.includes(pattern)
  );
  
  if (hasUrgentLanguage) {
    indicators.push({
      type: 'phishing',
      severity: 'high',
      description: 'Email contains urgent language often used in phishing attacks',
      evidence: 'Detected urgent/pressure language',
    });
  }
  
  // Credential harvesting patterns
  const credentialPatterns = [
    'password', 'username', 'login', 'sign in', 'verify',
    'update your information', 'confirm your details'
  ];
  
  const hasCredentialHarvesting = credentialPatterns.some(pattern => 
    body.includes(pattern) && body.includes('click')
  );
  
  if (hasCredentialHarvesting) {
    indicators.push({
      type: 'phishing',
      severity: 'critical',
      description: 'Email may be attempting to harvest credentials',
      evidence: 'Credential-related language with action prompts',
    });
  }
  
  // Suspicious links
  const linkPatterns = [
    'bit.ly', 'tinyurl', 'goo.gl', 't.co',
    'click here', 'verify now', 'login now'
  ];
  
  const hasSuspiciousLinks = linkPatterns.some(pattern => 
    body.includes(pattern)
  );
  
  if (hasSuspiciousLinks) {
    indicators.push({
      type: 'suspicious-links',
      severity: 'medium',
      description: 'Email contains suspicious or shortened links',
      evidence: 'Detected URL shorteners or suspicious link text',
    });
  }
  
  return indicators;
}

/**
 * Spoofing Detection
 * Heuristic rules to detect email spoofing
 */
export function detectSpoofing(email: RawEmail): ThreatIndicator[] {
  const indicators: ThreatIndicator[] = [];
  const fromDomain = email.headers.from.email.split('@')[1].toLowerCase();
  const subject = email.headers.subject.toLowerCase();
  
  // Display name mismatch
  const displayName = email.headers.from.name.toLowerCase();
  const emailUsername = email.headers.from.email.split('@')[0].toLowerCase();
  
  if (displayName.includes('ceo') || displayName.includes('president') || 
      displayName.includes('manager') || displayName.includes('admin')) {
    if (!fromDomain.includes('company') && !fromDomain.includes('corp')) {
      indicators.push({
        type: 'impersonation',
        severity: 'high',
        description: 'Email claims to be from executive but uses non-corporate domain',
        evidence: `Display name: ${email.headers.from.name}, Domain: ${fromDomain}`,
      });
    }
  }
  
  // Domain lookalike detection
  const commonDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
  const isLookalike = commonDomains.some(domain => {
    const misspelled = fromDomain.replace(/[aeiou]/g, '');
    return domain.includes(misspelled) || misspelled.includes(domain.replace(/[aeiou]/g, ''));
  });
  
  if (isLookalike) {
    indicators.push({
      type: 'spoofing',
      severity: 'critical',
      description: 'Email domain appears to be a lookalike of a common service',
      evidence: `Domain: ${fromDomain} may be spoofing a common email provider`,
    });
  }
  
  // Reply-to mismatch
  if (email.headers.returnPath && email.headers.returnPath !== email.headers.from.email) {
    const replyDomain = email.headers.returnPath.split('@')[1].toLowerCase();
    if (replyDomain !== fromDomain) {
      indicators.push({
        type: 'spoofing',
        severity: 'medium',
        description: 'Reply-to address differs from sender address',
        evidence: `From: ${fromDomain}, Reply-to: ${replyDomain}`,
      });
    }
  }
  
  return indicators;
}

/**
 * Suspicious Attachment Detection
 * Heuristic rules to detect dangerous attachments
 */
export function detectSuspiciousAttachments(email: RawEmail): ThreatIndicator[] {
  const indicators: ThreatIndicator[] = [];
  
  if (!email.attachments || email.attachments.length === 0) {
    return indicators;
  }
  
  const dangerousExtensions = [
    '.exe', '.bat', '.cmd', '.scr', '.pif', '.com',
    '.vbs', '.js', '.jar', '.msi', '.dll'
  ];
  
  const suspiciousExtensions = [
    '.zip', '.rar', '.7z', '.doc', '.docm', '.xls', '.xlsm',
    '.ppt', '.pptm', '.pdf'
  ];
  
  email.attachments.forEach(attachment => {
    const filename = attachment.filename.toLowerCase();
    
    if (dangerousExtensions.some(ext => filename.endsWith(ext))) {
      indicators.push({
        type: 'suspicious-attachment',
        severity: 'critical',
        description: 'Email contains executable file attachment',
        evidence: `File: ${attachment.filename}`,
      });
    }
    
    if (suspiciousExtensions.some(ext => filename.endsWith(ext))) {
      indicators.push({
        type: 'suspicious-attachment',
        severity: 'medium',
        description: 'Email contains potentially risky attachment type',
        evidence: `File: ${attachment.filename}`,
      });
    }
    
    // Double extension evasion
    if ((filename.match(/\./g) || []).length > 1) {
      indicators.push({
        type: 'suspicious-attachment',
        severity: 'high',
        description: 'Attachment has multiple extensions (evasion technique)',
        evidence: `File: ${attachment.filename}`,
      });
    }
  });
  
  return indicators;
}
