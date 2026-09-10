'use client';

import { ExtendedAnalysisResult, RawEmail } from '@/lib/types';
import { ThreatOverview } from './ThreatOverview';
import { EmailDetails } from './EmailDetails';
import { SecurityChecks } from '../email-view/SecurityChecks';
import { OriginRelayAnalysis } from './OriginRelayAnalysis';
import { AIInvestigation } from './AIInvestigation';
import { URLIntelligence } from './URLIntelligence';
import { ThreatIndicators } from '../email-view/ThreatIndicators';
import { EvidencePackage } from './EvidencePackage';
import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';

interface SecurityAnalyticsProps {
  analysis: ExtendedAnalysisResult;
  email: RawEmail;
}

const panelVariants = {
  hidden:  { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.07, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export function SecurityAnalytics({ analysis, email }: SecurityAnalyticsProps) {
  return (
    <div className="space-y-5">
      {/* Page heading */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'oklch(0.720 0.140 200 / 12%)',
            border:     '1px solid var(--border-accent)',
            boxShadow:  '0 0 12px oklch(0.720 0.140 200 / 15%)',
          }}
        >
          <Cpu className="h-4 w-4" style={{ color: 'var(--accent-cyan)' }} />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-foreground">Security Analytics</h1>
          <p className="text-xs text-muted-foreground">
            Forensic analysis · threat assessment · evidence package
          </p>
        </div>
      </div>

      {/* 1. Threat Overview */}
      <motion.div custom={0} initial="hidden" animate="visible" variants={panelVariants}>
        <ThreatOverview overview={analysis.threatOverview} />
      </motion.div>

      {/* 2. Email Details */}
      <motion.div custom={1} initial="hidden" animate="visible" variants={panelVariants}>
        <EmailDetails email={email} />
      </motion.div>

      {/* 3. Authentication */}
      <motion.div custom={2} initial="hidden" animate="visible" variants={panelVariants}>
        <SecurityChecks
          spf={analysis.securityChecks.spf}
          dkim={analysis.securityChecks.dkim}
          dmarc={analysis.securityChecks.dmarc}
        />
      </motion.div>

      {/* 4. Origin / Mail Relay */}
      <motion.div custom={3} initial="hidden" animate="visible" variants={panelVariants}>
        <OriginRelayAnalysis origin={analysis.originAnalysis} />
      </motion.div>

      {/* 5. AI Investigation */}
      <motion.div custom={4} initial="hidden" animate="visible" variants={panelVariants}>
        <AIInvestigation investigation={analysis.aiInvestigation} />
      </motion.div>

      {/* 6. URL Intelligence */}
      <motion.div custom={5} initial="hidden" animate="visible" variants={panelVariants}>
        <URLIntelligence urls={analysis.urlIntelligence} />
      </motion.div>

      {/* 7. Threat Indicators */}
      <motion.div custom={6} initial="hidden" animate="visible" variants={panelVariants}>
        <ThreatIndicators threats={analysis.threatIndicators} />
      </motion.div>

      {/* 8. Evidence Package */}
      <motion.div custom={7} initial="hidden" animate="visible" variants={panelVariants}>
        <EvidencePackage evidence={analysis.evidencePackage} />
      </motion.div>
    </div>
  );
}
