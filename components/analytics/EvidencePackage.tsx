'use client';

import { EvidencePackage as EvidencePackageType } from '@/lib/types';
import { Package, Download, Clock, Hash, FileCode, FileJson } from 'lucide-react';
import { motion } from 'framer-motion';

interface EvidencePackageProps {
  evidence: EvidencePackageType;
}

const exportFormats: {
  id: EvidencePackageType['exportFormats'][number];
  label: string;
  Icon: React.ElementType;
  ext: string;
}[] = [
  { id: 'pdf',  label: 'PDF Report',   Icon: Package,   ext: '.pdf' },
  { id: 'json', label: 'JSON Data',    Icon: FileJson,  ext: '.json' },
  { id: 'xml',  label: 'XML Export',   Icon: FileCode,  ext: '.xml' },
];

export function EvidencePackage({ evidence }: EvidencePackageProps) {
  const generatedDate = new Date(evidence.generatedAt);

  return (
    <div className="glass-panel rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{
            background: 'oklch(0.720 0.140 200 / 12%)',
            border: '1px solid var(--border-accent)',
          }}
        >
          <Package className="h-4 w-4" style={{ color: 'var(--accent-cyan)' }} />
        </div>
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Evidence Package
        </h2>
        <span
          className="ml-auto text-xs px-2 py-0.5 rounded-md font-mono"
          style={{
            background: 'oklch(0.720 0.140 200 / 8%)',
            border: '1px solid var(--border-accent)',
            color: 'var(--accent-cyan)',
          }}
        >
          v{evidence.analysisVersion}
        </span>
      </div>

      {/* Report meta card */}
      <div
        className="rounded-xl p-4 mb-5"
        style={{
          background: 'oklch(0.720 0.140 200 / 6%)',
          border: '1px solid oklch(0.720 0.140 200 / 18%)',
          boxShadow: 'inset 0 1px 0 oklch(0.720 0.140 200 / 8%)',
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-0.5">
            <div className="text-xs text-muted-foreground">Report ID</div>
            <div
              className="text-sm font-mono font-medium tracking-wider"
              style={{ color: 'var(--accent-cyan)' }}
            >
              {evidence.reportId}
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Generated
            </div>
            <div className="text-sm text-foreground">
              {generatedDate.toLocaleString(undefined, {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Hash className="h-3 w-3" />
              Chain of Custody
            </div>
            <div
              className="text-xs font-mono break-all leading-relaxed"
              style={{ color: 'oklch(0.70 0.015 250)' }}
            >
              {`CL-${evidence.reportId}-AUTH`}
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-xs text-muted-foreground">Analyst</div>
            <div className="text-sm text-foreground">
              Automated · Heuristic Engine
            </div>
          </div>
        </div>
      </div>

      {/* Export formats */}
      <div className="mb-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Export Evidence
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {exportFormats
            .filter(fmt => evidence.exportFormats.includes(fmt.id))
            .map((fmt, index) => {
              const { Icon } = fmt;
              return (
                <motion.button
                  key={fmt.id}
                  className="flex items-center gap-3 p-3.5 rounded-xl text-left transition-all duration-150 group"
                  style={{
                    background: 'oklch(0 0 0 / 20%)',
                    border: '1px solid oklch(1 0 0 / 8%)',
                  }}
                  whileHover={{
                    scale: 1.01,
                    boxShadow: '0 0 0 1px oklch(0.720 0.140 200 / 20%), 0 4px 12px oklch(0 0 0 / 30%)',
                  }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  aria-label={`Download ${fmt.label}`}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: 'oklch(0.720 0.140 200 / 10%)',
                      boxShadow: 'inset 0 1px 0 oklch(1 0 0 / 8%)',
                    }}
                  >
                    <Icon className="h-4 w-4" style={{ color: 'var(--accent-cyan)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-foreground">{fmt.label}</div>
                    <div className="text-xs text-muted-foreground">{fmt.ext}</div>
                  </div>
                  <Download
                    className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-accent-cyan"
                    style={{ color: 'var(--muted-foreground)' }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as SVGElement).style.color = 'var(--accent-cyan)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as SVGElement).style.color = 'var(--muted-foreground)';
                    }}
                  />
                </motion.button>
              );
            })}
        </div>
      </div>

      {/* Legal disclaimer */}
      <div
        className="rounded-xl p-3.5 text-xs leading-relaxed text-muted-foreground"
        style={{
          background: 'oklch(0 0 0 / 15%)',
          border: '1px solid oklch(1 0 0 / 6%)',
          borderLeft: '2px solid oklch(0.720 0.140 200 / 25%)',
        }}
      >
        This evidence package was generated automatically by the Cyber Leek heuristic analysis engine.
        Analysis results are for informational purposes only. Geolocation data is approximate.
        Confirm all findings with qualified security personnel before taking action.
      </div>
    </div>
  );
}
