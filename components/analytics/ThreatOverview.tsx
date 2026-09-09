'use client';

import type { ThreatOverview } from '@/lib/types';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, XCircle, Activity } from 'lucide-react';

interface ThreatOverviewProps {
  overview: ThreatOverview;
}

const riskConfig = {
  critical: { color: 'var(--danger)',      border: 'oklch(0.62 0.22 25 / 25%)',  bg: 'oklch(0.62 0.22 25 / 10%)',  Icon: XCircle,       glow: '0 0 16px oklch(0.62 0.22 25 / 25%)' },
  high:     { color: 'oklch(0.72 0.18 35)',border: 'oklch(0.72 0.18 35 / 25%)',  bg: 'oklch(0.72 0.18 35 / 10%)',  Icon: AlertTriangle,  glow: '0 0 12px oklch(0.72 0.18 35 / 20%)' },
  medium:   { color: 'var(--warning)',     border: 'oklch(0.72 0.16 75 / 20%)',  bg: 'oklch(0.72 0.16 75 / 8%)',   Icon: AlertTriangle,  glow: 'none' },
  low:      { color: 'var(--accent-cyan)', border: 'oklch(0.72 0.14 200 / 20%)', bg: 'oklch(0.72 0.14 200 / 8%)',  Icon: Shield,         glow: 'none' },
  safe:     { color: 'var(--safe)',        border: 'oklch(0.66 0.155 145 / 20%)',bg: 'oklch(0.66 0.155 145 / 8%)', Icon: CheckCircle,    glow: '0 0 12px oklch(0.66 0.155 145 / 20%)' },
};

const verdictConfig = {
  malicious:    { label: 'MALICIOUS',    color: 'var(--danger)',      bg: 'oklch(0.62 0.22 25 / 12%)' },
  suspicious:   { label: 'SUSPICIOUS',   color: 'oklch(0.72 0.18 35)',bg: 'oklch(0.72 0.18 35 / 10%)' },
  caution:      { label: 'CAUTION',      color: 'var(--warning)',     bg: 'oklch(0.72 0.16 75 / 10%)' },
  likely_safe:  { label: 'LIKELY SAFE',  color: 'var(--accent-cyan)', bg: 'oklch(0.72 0.14 200 / 10%)' },
  safe:         { label: 'SAFE',         color: 'var(--safe)',        bg: 'oklch(0.66 0.155 145 / 10%)' },
};

function getGaugeColor(score: number) {
  if (score >= 80) return 'var(--safe)';
  if (score >= 60) return 'var(--warning)';
  if (score >= 40) return 'oklch(0.72 0.18 45)';
  return 'var(--danger)';
}

export function ThreatOverview({ overview }: ThreatOverviewProps) {
  const risk    = riskConfig[overview.riskLevel];
  const verdict = verdictConfig[overview.verdict];
  const RiskIcon = risk.Icon;
  const gaugeColor = getGaugeColor(overview.safetyScore);

  return (
    <div
      className="rounded-xl p-6"
      style={{
        background: 'var(--surface-1)',
        border:     '1px solid oklch(1 0 0 / 7%)',
        boxShadow:  'inset 0 1px 0 oklch(1 0 0 / 4%), 0 4px 24px oklch(0 0 0 / 25%)',
      }}
    >
      {/* Panel header */}
      <div className="flex items-center gap-2 mb-6">
        <Activity className="h-4 w-4" style={{ color: 'var(--accent-cyan)' }} />
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Threat Overview
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk + Verdict */}
        <div className="space-y-3">
          {/* Risk level */}
          <div
            className="p-4 rounded-xl"
            style={{
              background: risk.bg,
              border:     `1px solid ${risk.border}`,
              boxShadow:  risk.glow,
            }}
          >
            <div className="flex items-center gap-3">
              <RiskIcon className="h-6 w-6 flex-shrink-0" style={{ color: risk.color }} />
              <div>
                <div className="text-xs text-muted-foreground mb-0.5">Risk Level</div>
                <div
                  className="text-xl font-bold uppercase tracking-wider"
                  style={{ color: risk.color }}
                >
                  {overview.riskLevel}
                </div>
              </div>
            </div>
          </div>

          {/* Verdict */}
          <div
            className="p-4 rounded-xl"
            style={{ background: verdict.bg, border: `1px solid ${verdict.color}30` }}
          >
            <div className="text-xs text-muted-foreground mb-1">Analysis Verdict</div>
            <div className="text-lg font-bold" style={{ color: verdict.color }}>
              {verdict.label}
            </div>
          </div>

          {/* Additional flags */}
          <div className="grid grid-cols-2 gap-2">
            <StatItem
              label="Attack Type"
              value={overview.attackType.replace('_', ' ').toUpperCase()}
            />
            <StatItem
              label="Social Eng."
              value={overview.socialEngineeringDetected ? 'DETECTED' : 'NONE'}
              valueColor={overview.socialEngineeringDetected ? 'var(--warning)' : 'var(--safe)'}
            />
          </div>
        </div>

        {/* Safety Score Gauge */}
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="relative w-44 h-44">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Track */}
              <circle
                cx="50" cy="50" r="42"
                fill="none"
                stroke="oklch(1 0 0 / 6%)"
                strokeWidth="7"
              />
              {/* Progress */}
              <motion.circle
                cx="50" cy="50" r="42"
                fill="none"
                stroke={gaugeColor}
                strokeWidth="7"
                strokeLinecap="round"
                style={{
                  strokeDasharray: '263.9',
                  filter: `drop-shadow(0 0 6px ${gaugeColor})`,
                }}
                initial={{ strokeDashoffset: 263.9 }}
                animate={{ strokeDashoffset: 263.9 * (1 - overview.safetyScore / 100) }}
                transition={{ duration: 1.2, delay: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                className="text-4xl font-bold tabular-nums leading-none"
                style={{ color: gaugeColor }}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {overview.safetyScore}
              </motion.div>
              <div className="text-xs text-muted-foreground mt-1">/ 100</div>
            </div>
          </div>
          <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Safety Score
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        <StatCard label="Confidence"   value={`${overview.confidence}%`} />
        <StatCard label="URLs Found"   value={overview.urlCount} />
        <StatCard label="Attachments"  value={overview.attachmentCount} />
        <StatCard label="Indicators"   value={overview.threatIndicatorCount} />
      </div>

      {/* Details row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
        <StatItem label="Phishing Classification"
          value={overview.phishingClassification.replace('_', ' ').toUpperCase()} />
        <StatItem label="Reputation Checks"
          value={overview.reputationCheckCount.toString()} />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div
      className="p-3 rounded-lg text-center"
      style={{ background: 'oklch(0 0 0 / 18%)', border: '1px solid oklch(1 0 0 / 6%)' }}
    >
      <div className="text-2xl font-bold tabular-nums text-foreground">{value.toString()}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function StatItem({
  label, value, valueColor = 'var(--foreground)',
}: { label: string; value: string | number; valueColor?: string }) {
  return (
    <div
      className="flex justify-between items-center px-3 py-2.5 rounded-lg"
      style={{ background: 'oklch(0 0 0 / 18%)', border: '1px solid oklch(1 0 0 / 6%)' }}
    >
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xs font-semibold" style={{ color: valueColor }}>{value.toString()}</span>
    </div>
  );
}
