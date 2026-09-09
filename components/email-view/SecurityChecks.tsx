'use client';

import { SecurityCheckResult, SecurityCheckStatus } from '@/lib/types';
import { CheckCircle2, XCircle, MinusCircle, HelpCircle, ShieldCheck } from 'lucide-react';

interface SecurityChecksProps {
  spf: SecurityCheckResult;
  dkim: SecurityCheckResult;
  dmarc: SecurityCheckResult;
}

const statusConfig: Record<SecurityCheckStatus, {
  color: string;
  bg: string;
  border: string;
  Icon: React.ElementType;
  label: string;
}> = {
  pass: {
    color:  'var(--safe)',
    bg:     'oklch(0.66 0.155 145 / 10%)',
    border: 'oklch(0.66 0.155 145 / 20%)',
    Icon:   CheckCircle2,
    label:  'PASS',
  },
  fail: {
    color:  'var(--danger)',
    bg:     'oklch(0.62 0.22 25 / 10%)',
    border: 'oklch(0.62 0.22 25 / 20%)',
    Icon:   XCircle,
    label:  'FAIL',
  },
  neutral: {
    color:  'var(--muted-foreground)',
    bg:     'oklch(1 0 0 / 4%)',
    border: 'oklch(1 0 0 / 8%)',
    Icon:   MinusCircle,
    label:  'NEUTRAL',
  },
  unknown: {
    color:  'var(--warning)',
    bg:     'oklch(0.72 0.16 75 / 10%)',
    border: 'oklch(0.72 0.16 75 / 20%)',
    Icon:   HelpCircle,
    label:  'UNKNOWN',
  },
};

export function SecurityChecks({ spf, dkim, dmarc }: SecurityChecksProps) {
  const checks = [
    { name: 'SPF',   result: spf,  description: 'Sender Policy Framework' },
    { name: 'DKIM',  result: dkim, description: 'DomainKeys Identified Mail' },
    { name: 'DMARC', result: dmarc,description: 'Domain-based Message Authentication' },
  ];

  return (
    <div
      className="rounded-xl p-5"
      style={{
        background:  'var(--surface-1)',
        border:      '1px solid oklch(1 0 0 / 7%)',
        boxShadow:   'inset 0 1px 0 oklch(1 0 0 / 4%)',
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="h-4 w-4" style={{ color: 'var(--accent-cyan)' }} />
        <h3 className="text-sm font-semibold text-foreground">Authentication</h3>
      </div>

      <div className="space-y-2.5">
        {checks.map((check) => {
          const cfg = statusConfig[check.result.status];
          const { Icon } = cfg;
          return (
            <div
              key={check.name}
              className="flex items-start justify-between gap-3 p-3 rounded-lg"
              style={{ background: 'oklch(0 0 0 / 15%)', border: '1px solid oklch(1 0 0 / 6%)' }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-foreground tracking-wide">
                    {check.name}
                  </span>
                  <span className="text-xs text-muted-foreground">{check.description}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{check.result.details}</p>
                {check.result.domain && (
                  <p className="text-xs mt-1" style={{ color: 'var(--accent-cyan)', opacity: 0.7 }}>
                    {check.result.domain}
                  </p>
                )}
              </div>
              <div
                className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold flex-shrink-0"
                style={{
                  color:      cfg.color,
                  background: cfg.bg,
                  border:     `1px solid ${cfg.border}`,
                }}
              >
                <Icon className="h-3 w-3" />
                {cfg.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
