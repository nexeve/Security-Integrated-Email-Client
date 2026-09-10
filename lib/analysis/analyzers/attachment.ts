import { RawEmail, ThreatIndicator } from '../../types';

export function analyzeAttachments(email: RawEmail): ThreatIndicator[] {
  const indicators: ThreatIndicator[] = [];
  
  if (!email.attachments || email.attachments.length === 0) {
    return indicators;
  }
  
  const dangerousExtensions = [
    '.exe', '.bat', '.cmd', '.scr', '.pif', '.com',
    '.vbs', '.js', '.jar', '.msi', '.dll'
  ];
  
  email.attachments.forEach(attachment => {
    const filename = attachment.filename.toLowerCase();
    
    // Check for dangerous extensions
    if (dangerousExtensions.some(ext => filename.endsWith(ext))) {
      indicators.push({
        id: 'DANGEROUS_ATTACHMENT_EXTENSION',
        category: 'malware',
        severity: 'high',
        confidence: 'high',
        title: 'Dangerous Attachment Extension',
        explanation: 'The email contains an executable file attachment, which is a significant security risk.',
        evidence: `File: ${attachment.filename}`,
        source: 'attachment-analyzer',
        contributesToRisk: true
      });
    }
    
    // Double extension evasion
    if ((filename.match(/\./g) || []).length > 1) {
      // Allow valid multiple extensions like .tar.gz
      if (!filename.endsWith('.tar.gz') && !filename.endsWith('.tar.bz2')) {
        indicators.push({
          id: 'MULTIPLE_EXTENSIONS_DETECTED',
          category: 'evasion',
          severity: 'medium',
          confidence: 'medium',
          title: 'Multiple Extensions Detected',
          explanation: 'An attachment has multiple extensions, a common technique to hide the true file type.',
          evidence: `File: ${attachment.filename}`,
          source: 'attachment-analyzer',
          contributesToRisk: true
        });
      }
    }
  });
  
  return indicators;
}
