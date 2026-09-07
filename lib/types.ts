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

// ==================== EXTENDED ANALYTICS TYPES ====================

export type RiskLevel = 'critical' | 'high' | 'medium' | 'low' | 'safe';
export type Verdict = 'malicious' | 'suspicious' | 'caution' | 'likely_safe' | 'safe';
export type AttackType = 'phishing' | 'spoofing' | 'malware' | 'social_engineering' | 'business_email_compromise' | 'unknown' | 'none';
export type PhishingClassification = 'credential_harvesting' | 'fake_invoice' | 'tech_support' | 'ceo_fraud' | 'account_verification' | 'none';
export type URLReputation = 'malicious' | 'suspicious' | 'unknown' | 'safe';

export interface ThreatOverview {
  riskLevel: RiskLevel;
  confidence: number; // 0-100
  safetyScore: number; // 0-100
  verdict: Verdict;
  attackType: AttackType;
  phishingClassification: PhishingClassification;
  socialEngineeringDetected: boolean;
  urlCount: number;
  attachmentCount: number;
  threatIndicatorCount: number;
  reputationCheckCount: number;
}

export interface RelayHop {
  hopNumber: number;
  ip: string;
  hostname?: string;
  provider?: string;
  location?: {
    country: string;
    city?: string;
    region?: string;
  };
  timestamp?: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface OriginAnalysis {
  earliestReliableIP: string;
  confidence: 'high' | 'medium' | 'low';
  senderDomain: string;
  replyToDomain: string;
  relayPath: RelayHop[];
  earliestOrigin: {
    ip: string;
    location: {
      country: string;
      city?: string;
      region?: string;
    };
    provider?: string;
  };
  totalHops: number;
}

export interface AIInvestigation {
  executiveAssessment: string;
  keyEvidence: string[];
  socialEngineeringIndicators: string[];
  recommendedActions: string[];
  confidence: number; // 0-100
  analysisTimestamp: string;
}

export interface URLIntelligenceItem {
  url: string;
  domain: string;
  reputation: URLReputation;
  status: string;
  threatType?: string;
  firstSeen?: string;
  lastSeen?: string;
  riskScore: number; // 0-100
}

export interface EvidencePackage {
  reportId: string;
  generatedAt: string;
  analysisVersion: string;
  canExport: boolean;
  exportFormats: ('pdf' | 'json' | 'xml')[];
  summary: string;
}

// Extended AnalysisResult to include new analytics fields
export interface ExtendedAnalysisResult extends AnalysisResult {
  threatOverview: ThreatOverview;
  originAnalysis: OriginAnalysis;
  aiInvestigation: AIInvestigation;
  urlIntelligence: URLIntelligenceItem[];
  evidencePackage: EvidencePackage;
}
