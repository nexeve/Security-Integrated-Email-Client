'use client';

import { URLIntelligenceItem } from '@/lib/types';
import { Link2, AlertTriangle, CheckCircle, XCircle, ExternalLink } from 'lucide-react';

interface URLIntelligenceProps {
  urls: URLIntelligenceItem[];
}

type Reputation = URLIntelligenceItem['reputation'];

const reputationConfig: Record<Reputation, {
  color: string; bg: string; border: string; Icon: React.ElementType; label: string;
}> = {
  malicious: {
    color:  'var(--danger)',
    bg:     'oklch(0.62 0.22 25 / 10%)',
    border: 'oklch(0.62 0.22 25 / 22%)',
    Icon:   XCircle,
    label:  'MALICIOUS',
  },
  suspicious: {
    color:  'oklch(0.72 0.18 35)',
    bg:     'oklch(0.72 0.18 35 / 10%)',
    border: 'oklch(0.72 0.18 35 / 22%)',
    Icon:   AlertTriangle,
    label:  'SUSPICIOUS',
  },
  unknown: {
    color:  'var(--muted-foreground)',
    bg:     'oklch(1 0 0 / 4%)',
    border: 'oklch(1 0 0 / 8%)',
    Icon:   Link2,
    label:  'UNKNOWN',
  },
  safe: {
    color:  'var(--safe)',
    bg:     'oklch(0.66 0.155 145 / 10%)',
    border: 'oklch(0.66 0.155 145 / 22%)',
    Icon:   CheckCircle,
    label:  'SAFE',
  },
};

function RiskBar({ score }: { score: number }) {
  const color =
    score >= 75 ? 'var(--danger)'   :
    score >= 50 ? 'var(--warning)'  :
    score >= 25 ? 'oklch(0.72 0.18 45)' :
                  'var(--safe)';
  return (
    <div className="flex items-center gap-2">
      <div
        className="flex-1 h-1.5 rounded-full overflow-hidden"
        style={{ background: 'oklch(1 0 0 / 8%)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
      <span className="text-xs tabular-nums w-6 text-right" style={{ color }}>
        {score}
      </span>
    </div>
  );
}

export function URLIntelligence({ urls }: URLIntelligenceProps) {
  if (urls.length === 0) {
    return (
      <div
        className="glass-panel rounded-2xl p-6"
      >
        <div className="flex items-center gap-2 mb-3">
          <Link2 className="h-4 w-4" style={{ color: 'var(--accent-cyan)' }} />
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            URL Intelligence
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">No URLs detected in this email.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <Link2 className="h-4 w-4" style={{ color: 'var(--accent-cyan)' }} />
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            URL Intelligence
          </h2>
        </div>
        <span
          className="text-xs px-2 py-0.5 rounded-lg font-medium tabular-nums"
          style={{
            background: 'oklch(0.720 0.140 200 / 10%)',
            color:      'var(--accent-cyan)',
            border:     '1px solid var(--border-accent)',
          }}
        >
          {urls.length} link{urls.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-3">
        {urls.map((item, index) => {
          const cfg = reputationConfig[item.reputation];
          const { Icon } = cfg;

          return (
            <div
              key={index}
              className="rounded-xl p-4 space-y-3"
              style={{
                background: cfg.bg,
                border:     `1px solid ${cfg.border}`,
              }}
            >
              {/* URL row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: cfg.color }} />
                  <span
                    className="text-xs font-mono break-all leading-relaxed"
                    style={{ color: 'oklch(0.80 0.010 245)' }}
                  >
                    {item.url}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-md"
                    style={{
                      color:      cfg.color,
                      background: 'oklch(0 0 0 / 20%)',
                    }}
                  >
                    {cfg.label}
                  </span>
                  <button
                    className="p-1 rounded-md transition-colors text-muted-foreground hover:text-foreground"
                    style={{ background: 'oklch(1 0 0 / 5%)' }}
                    title="Open URL (use caution)"
                    aria-label={`Open URL: ${item.url}`}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Domain + metadata */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Domain: </span>
                  <span style={{ color: 'var(--accent-cyan)' }}>{item.domain}</span>
                </div>
                {item.threatType && (
                  <div>
                    <span className="text-muted-foreground">Threat: </span>
                    <span style={{ color: cfg.color }}>
                      {item.threatType.replace(/_/g, ' ')}
                    </span>
                  </div>
                )}
                {item.firstSeen && (
                  <div>
                    <span className="text-muted-foreground">First seen: </span>
                    <span className="text-foreground">
                      {new Date(item.firstSeen).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {item.lastSeen && (
                  <div>
                    <span className="text-muted-foreground">Last seen: </span>
                    <span className="text-foreground">
                      {new Date(item.lastSeen).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Risk score bar */}
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Risk Score</div>
                <RiskBar score={item.riskScore} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
