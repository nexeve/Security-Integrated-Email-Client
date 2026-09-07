import { ExtendedAnalysisResult } from '@/lib/types';
import { ThreatOverview } from './ThreatOverview';
import { EmailDetails } from './EmailDetails';
import { SecurityChecks } from '../email-view/SecurityChecks';
import { OriginRelayAnalysis } from './OriginRelayAnalysis';
import { AIInvestigation } from './AIInvestigation';
import { URLIntelligence } from './URLIntelligence';
import { ThreatIndicators } from '../email-view/ThreatIndicators';
import { EvidencePackage } from './EvidencePackage';

interface SecurityAnalyticsProps {
  analysis: ExtendedAnalysisResult;
  email: any; // RawEmail - keeping any for now to avoid circular import
}

export function SecurityAnalytics({ analysis, email }: SecurityAnalyticsProps) {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Security Analytics</h1>
        <p className="text-sm text-gray-500">Detailed forensic analysis and threat assessment</p>
      </div>

      {/* 1. Threat Overview */}
      <ThreatOverview overview={analysis.threatOverview} />

      {/* 2. Email Details */}
      <EmailDetails email={email} />

      {/* 3. Email Authentication */}
      <SecurityChecks
        spf={analysis.securityChecks.spf}
        dkim={analysis.securityChecks.dkim}
        dmarc={analysis.securityChecks.dmarc}
      />

      {/* 4. Origin / Mail Relay Analysis */}
      <OriginRelayAnalysis origin={analysis.originAnalysis} />

      {/* 5. AI Investigation */}
      <AIInvestigation investigation={analysis.aiInvestigation} />

      {/* 6. URL Intelligence */}
      <URLIntelligence urls={analysis.urlIntelligence} />

      {/* 7. Threat Indicators */}
      <ThreatIndicators threats={analysis.threatIndicators} />

      {/* 8. Final Evidence Package */}
      <EvidencePackage evidence={analysis.evidencePackage} />
    </div>
  );
}
