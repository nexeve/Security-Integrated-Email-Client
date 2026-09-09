'use client';

import { ThreatIndicator } from '@/lib/types';
import { AlertTriangle, AlertOctagon, Info, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface ThreatIndicatorsProps {
  threats: ThreatIndicator[];
}

const severityConfig: Record<ThreatIndicator['severity'], {
  color: string;
  bg: string;
  border: string;
  Icon: React.ElementType;
  glow: string;
}> = {
  critical: {
    color:  'var(--danger)',
    bg:     'oklch(0.62 0.22 25 / 10%)',
    border: 'oklch(0.62 0.22 25 / 25%)',
    Icon:   AlertOctagon,
    glow:   '0 0 12px oklch(0.62 0.22 25 / 20%)',
  },
  high: {
    color:  'oklch(0.72 0.18 35)',
    bg:     'oklch(0.72 0.18 35 / 10%)',
    border: 'oklch(0.72 0.18 35 / 25%)',
    Icon:   AlertTriangle,
    glow:   '0 0 10px oklch(0.72 0.18 35 / 15%)',
  },
  medium: {
    color:  'var(--warning)',
    bg:     'oklch(0.72 0.16 75 / 10%)',
    border: 'oklch(0.72 0.16 75 / 20%)',
    Icon:   AlertTriangle,
    glow:   'none',
  },
  low: {
    color:  'var(--accent-cyan)',
    bg:     'oklch(0.72 0.14 200 / 8%)',
    border: 'oklch(0.72 0.14 200 / 20%)',
    Icon:   Info,
    glow:   'none',
  },
};

export function ThreatIndicators({ threats }: ThreatIndicatorsProps) {
  if (threats.length === 0) {
    return (
      <div
        className="rounded-xl p-5"
        style={{
          background: 'var(--surface-1)',
          border: '1px solid oklch(1 0 0 / 7%)',
          boxShadow: 'inset 0 1px 0 oklch(1 0 0 / 4%)',
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <ShieldAlert className="h-4 w-4" style={{ color: 'var(--accent-cyan)' }} />
          <h3 className="text-sm font-semibold text-foreground">Threat Indicators</h3>
        </div>
        <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--safe)' }}>
          <CheckCircle2 className="h-4 w-4" />
          No threats detected
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl p-5"
      style={{
        background: 'var(--surface-1)',
        border: '1px solid oklch(1 0 0 / 7%)',
        boxShadow: 'inset 0 1px 0 oklch(1 0 0 / 4%)',
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <ShieldAlert className="h-4 w-4" style={{ color: 'var(--danger)' }} />
        <h3 className="text-sm font-semibold text-foreground">
          Threat Indicators
          <span
            className="ml-2 text-xs px-1.5 py-0.5 rounded-md font-bold"
            style={{
              color: 'var(--danger)',
              background: 'oklch(0.62 0.22 25 / 15%)',
            }}
          >
            {threats.length}
          </span>
        </h3>
      </div>

      <div className="space-y-2.5">
        {threats.map((threat, index) => {
          const cfg = severityConfig[threat.severity];
          const { Icon } = cfg;
          return (
            <div
              key={index}
              className="p-3 rounded-lg"
              style={{
                background: cfg.bg,
                border:     `1px solid ${cfg.border}`,
                boxShadow:  cfg.glow,
              }}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 flex-shrink-0" style={{ color: cfg.color }} />
                  <span
                    className="text-xs font-semibold uppercase tracking-wide"
                    style={{ color: cfg.color }}
                  >
                    {threat.type.replace(/-/g, ' ')}
                  </span>
                </div>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded flex-shrink-0"
                  style={{
                    color:      cfg.color,
                    background: 'oklch(0 0 0 / 20%)',
                  }}
                >
                  {threat.severity.toUpperCase()}
                </span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'oklch(0.75 0.010 250)' }}>
                {threat.description}
              </p>
              {threat.evidence && (
                <p className="text-xs mt-2 italic" style={{ color: 'var(--muted-foreground)' }}>
                  Evidence: {threat.evidence}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
