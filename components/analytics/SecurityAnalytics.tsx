import { AnalysisResult } from '@/lib/types';
import { SafetyScore } from '../email-view/SafetyScore';
import { ThreatIndicators } from '../email-view/ThreatIndicators';
import { SecurityChecks } from '../email-view/SecurityChecks';
import { OriginInfo } from '../email-view/OriginInfo';
import { ForensicPanel } from '../email-view/ForensicPanel';

interface SecurityAnalyticsProps {
  analysis: AnalysisResult;
  senderEmail: string;
  senderName: string;
}

export function SecurityAnalytics({ analysis, senderEmail, senderName }: SecurityAnalyticsProps) {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Security Analytics</h1>
        <p className="text-sm text-gray-500">Detailed forensic analysis and threat assessment</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SafetyScore score={analysis.safetyScore} />
        <SecurityChecks
          spf={analysis.securityChecks.spf}
          dkim={analysis.securityChecks.dkim}
          dmarc={analysis.securityChecks.dmarc}
        />
      </div>

      <ThreatIndicators threats={analysis.threatIndicators} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OriginInfo
          geolocation={analysis.geolocation}
          senderEmail={senderEmail}
          senderName={senderName}
        />
      </div>

      <ForensicPanel forensic={analysis.forensicDetails} />
    </div>
  );
}
