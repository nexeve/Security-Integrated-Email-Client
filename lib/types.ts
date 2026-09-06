export type EmailCategory = 'normal' | 'spam' | 'promotional' | 'malicious' | 'suspicious';

export type SecurityCheckStatus = 'pass' | 'fail' | 'neutral' | 'unknown';

export interface EmailSender {
  name: string;
  email: string;
}

export interface EmailRecipient {
  name: string;
  email: string;
}

export interface EmailHeaders {
  from: EmailSender;
  to: EmailRecipient[];
  cc?: EmailRecipient[];
  subject: string;
  date: Date;
  messageId?: string;
  returnPath?: string;
  received?: string[];
  spf?: string;
  dkim?: string;
  dmarc?: string;
}

export interface EmailAttachment {
  filename: string;
  contentType: string;
  size: number;
}

export interface RawEmail {
  id: string;
  headers: EmailHeaders;
  body: string;
  htmlBody?: string;
  attachments?: EmailAttachment[];
  metadata?: {
    ip?: string;
    userAgent?: string;
    timezone?: string;
  };
}

export interface ThreatIndicator {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  evidence?: string;
}

export interface SecurityCheckResult {
  status: SecurityCheckStatus;
  details: string;
  domain?: string;
}

export interface GeolocationInfo {
  country: string;
  city?: string;
  region?: string;
  ip: string;
  isp?: string;
  accuracy: 'high' | 'medium' | 'low';
}

export interface ScoreFactor {
  factor: string;
  impact: number; // Negative or positive impact on score
  description: string;
}

export interface ForensicInfo {
  summary: string;
  scoreFactors: ScoreFactor[];
  technicalDetails: {
    headers: Record<string, string>;
    analysisTimestamp: string;
    analysisVersion: string;
  };
  recommendations: string[];
}

export interface AnalysisResult {
  safetyScore: number; // 0-100
  category: EmailCategory;
  threatIndicators: ThreatIndicator[];
  securityChecks: {
    spf: SecurityCheckResult;
    dkim: SecurityCheckResult;
    dmarc: SecurityCheckResult;
  };
  geolocation: GeolocationInfo;
  forensicDetails: ForensicInfo;
}

export interface EmailWithAnalysis extends RawEmail {
  analysis: AnalysisResult;
}
