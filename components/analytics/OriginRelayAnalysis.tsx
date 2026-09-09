'use client';

import { OriginAnalysis } from '@/lib/types';
import { Globe, MapPin, Network } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import map to avoid SSR issues
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div
      className="h-80 rounded-xl flex items-center justify-center"
      style={{ background: 'oklch(0 0 0 / 20%)', border: '1px solid oklch(1 0 0 / 6%)' }}
    >
      <span className="text-sm text-muted-foreground">Loading map…</span>
    </div>
  ),
});

interface OriginRelayAnalysisProps {
  origin: OriginAnalysis;
}

function OriginDetail({
  icon: Icon,
  label,
  value,
  valueColor = 'var(--foreground)',
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div
      className="flex items-center gap-3 p-3 rounded-lg"
      style={{ background: 'oklch(0 0 0 / 18%)', border: '1px solid oklch(1 0 0 / 6%)' }}
    >
      <div
        className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
        style={{ background: 'oklch(0.720 0.140 200 / 10%)' }}
      >
        <Icon className="h-3.5 w-3.5" style={{ color: 'var(--accent-cyan)' }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-sm font-medium truncate" style={{ color: valueColor }}>{value}</div>
      </div>
    </div>
  );
}

export function OriginRelayAnalysis({ origin }: OriginRelayAnalysisProps) {
  const confidenceColor =
    origin.confidence === 'high'   ? 'var(--safe)'    :
    origin.confidence === 'medium' ? 'var(--warning)' : 'var(--danger)';

  return (
    <div
      className="rounded-xl p-6"
      style={{
        background: 'var(--surface-1)',
        border:     '1px solid oklch(1 0 0 / 7%)',
        boxShadow:  'inset 0 1px 0 oklch(1 0 0 / 4%)',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <Globe className="h-4 w-4" style={{ color: 'var(--accent-cyan)' }} />
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Origin / Mail Relay Analysis
        </h2>
      </div>

      {/* Origin summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mb-6">
        <OriginDetail icon={MapPin}  label="Earliest Reliable IP" value={origin.earliestReliableIP} />
        <OriginDetail icon={Network} label="Confidence"
          value={origin.confidence.toUpperCase()} valueColor={confidenceColor} />
        <OriginDetail icon={Globe}   label="Sender Domain"  value={origin.senderDomain} />
        <OriginDetail icon={Globe}   label="Reply-To Domain" value={origin.replyToDomain} />
      </div>

      {/* Geographic map */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Geographic Visualization
          </span>
        </div>
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid oklch(1 0 0 / 8%)' }}>
          <MapComponent origin={origin} />
        </div>
        <p className="text-xs text-muted-foreground mt-2 ml-1">
          * Lines represent observed relay sequence for visualization only
        </p>
      </div>

      {/* Relay path */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Mail Relay Path
          </span>
          <span
            className="text-xs px-1.5 py-0.5 rounded font-medium"
            style={{ background: 'oklch(0.720 0.140 200 / 10%)', color: 'var(--accent-cyan)' }}
          >
            {origin.totalHops} hops
          </span>
        </div>

        <div className="space-y-2">
          {origin.relayPath.map((hop, index) => {
            const isOrigin = hop.role === 'earliest_origin';
            const hopConfidenceColor =
              hop.confidence === 'high'   ? 'var(--safe)'    :
              hop.confidence === 'medium' ? 'var(--warning)' : 'var(--danger)';

            return (
              <div key={hop.hopNumber} className="flex items-start gap-3">
                {/* Node + connector */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={
                      isOrigin
                        ? {
                            background: 'var(--accent-cyan)',
                            color: 'oklch(0.095 0.022 258)',
                            boxShadow: '0 0 8px oklch(0.720 0.140 200 / 40%)',
                          }
                        : { background: 'oklch(1 0 0 / 8%)', color: 'var(--muted-foreground)' }
                    }
                  >
                    {hop.hopNumber}
                  </div>
                  {index < origin.relayPath.length - 1 && (
                    <div
                      className="w-px flex-1 my-1 min-h-3"
                      style={{ background: 'oklch(1 0 0 / 8%)' }}
                    />
                  )}
                </div>

                {/* Hop detail */}
                <div
                  className="flex-1 p-3 rounded-lg mb-2"
                  style={{
                    background: isOrigin
                      ? 'oklch(0.720 0.140 200 / 5%)'
                      : 'oklch(0 0 0 / 18%)',
                    border: isOrigin
                      ? '1px solid oklch(0.720 0.140 200 / 20%)'
                      : '1px solid oklch(1 0 0 / 6%)',
                  }}
                >
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {hop.hostname || hop.ip}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {isOrigin && (
                        <span
                          className="text-xs px-1.5 py-0.5 rounded font-semibold"
                          style={{
                            background: 'var(--accent-cyan)',
                            color: 'oklch(0.095 0.022 258)',
                          }}
                        >
                          ORIGIN
                        </span>
                      )}
                      <span
                        className="text-xs px-1.5 py-0.5 rounded"
                        style={{
                          color: hopConfidenceColor,
                          background: `${hopConfidenceColor}18`,
                        }}
                      >
                        {hop.confidence}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 text-xs text-muted-foreground">
                    <div>IP: <span className="text-foreground">{hop.ip}</span></div>
                    {hop.provider && <div>Provider: <span className="text-foreground">{hop.provider}</span></div>}
                    <div>Country: <span className="text-foreground">{hop.location?.country || 'Unknown'}</span></div>
                    {hop.location?.city && <div>City: <span className="text-foreground">{hop.location.city}</span></div>}
                  </div>

                  {hop.timestamp && (
                    <div className="text-xs text-muted-foreground mt-2">
                      {new Date(hop.timestamp).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
