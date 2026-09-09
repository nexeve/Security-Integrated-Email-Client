'use client';

import type { AIInvestigation } from '@/lib/types';
import { Brain, CheckCircle2, AlertTriangle, Target, Clock, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface AIInvestigationProps {
  investigation: AIInvestigation;
}

export function AIInvestigation({ investigation }: AIInvestigationProps) {
  return (
    <div
      className="rounded-xl p-6"
      style={{
        background: 'oklch(0.108 0.026 258)',
        border:     '1px solid oklch(0.720 0.140 200 / 15%)',
        boxShadow:  'inset 0 1px 0 oklch(0.720 0.140 200 / 8%), 0 4px 24px oklch(0 0 0 / 30%)',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{
            background: 'oklch(0.720 0.140 200 / 15%)',
            boxShadow:  '0 0 8px oklch(0.720 0.140 200 / 20%)',
          }}
        >
          <Brain className="h-4 w-4" style={{ color: 'var(--accent-cyan)' }} />
        </div>
        <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--accent-cyan)' }}>
          AI Investigation
        </h2>
        <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {new Date(investigation.analysisTimestamp).toLocaleString()}
        </div>
      </div>

      {/* Executive Assessment */}
      <div
        className="mb-6 p-4 rounded-xl"
        style={{
          background: 'oklch(0 0 0 / 20%)',
          border:     '1px solid oklch(0.720 0.140 200 / 12%)',
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Target className="h-3.5 w-3.5" style={{ color: 'var(--accent-cyan)' }} />
          <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--accent-cyan)' }}>
            Executive Assessment
          </h3>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.80 0.010 245)' }}>
          {investigation.executiveAssessment}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Key Evidence */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="h-3.5 w-3.5" style={{ color: 'var(--safe)' }} />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Key Evidence
            </h3>
          </div>
          <div className="space-y-1.5">
            {investigation.keyEvidence.map((evidence, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-2 p-2.5 rounded-lg"
                style={{ background: 'oklch(0 0 0 / 20%)', border: '1px solid oklch(1 0 0 / 6%)' }}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                  style={{ background: 'var(--safe)' }}
                />
                <span className="text-xs leading-relaxed" style={{ color: 'oklch(0.78 0.010 248)' }}>
                  {evidence}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Social Engineering Indicators */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-3.5 w-3.5" style={{ color: 'var(--warning)' }} />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Social Engineering
            </h3>
          </div>
          <div className="space-y-1.5">
            {investigation.socialEngineeringIndicators.length > 0 ? (
              investigation.socialEngineeringIndicators.map((indicator, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-2 p-2.5 rounded-lg"
                  style={{ background: 'oklch(0 0 0 / 20%)', border: '1px solid oklch(0.72 0.16 75 / 12%)' }}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                    style={{ background: 'var(--warning)' }}
                  />
                  <span className="text-xs leading-relaxed" style={{ color: 'oklch(0.78 0.010 248)' }}>
                    {indicator}
                  </span>
                </motion.div>
              ))
            ) : (
              <div
                className="p-3 rounded-lg text-xs text-muted-foreground"
                style={{ background: 'oklch(0 0 0 / 20%)', border: '1px solid oklch(1 0 0 / 6%)' }}
              >
                No social engineering indicators detected
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recommended Actions */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <ChevronRight className="h-3.5 w-3.5" style={{ color: 'var(--accent-cyan)' }} />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Recommended Actions
          </h3>
        </div>
        <div className="space-y-2">
          {investigation.recommendedActions.map((action, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg"
              style={{ background: 'oklch(0 0 0 / 20%)', border: '1px solid oklch(1 0 0 / 6%)' }}
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{
                  background: 'oklch(0.720 0.140 200 / 15%)',
                  color:      'var(--accent-cyan)',
                  border:     '1px solid oklch(0.720 0.140 200 / 25%)',
                }}
              >
                {index + 1}
              </div>
              <span className="text-xs leading-relaxed" style={{ color: 'oklch(0.80 0.010 245)' }}>
                {action}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Confidence bar */}
      <div
        className="flex items-center justify-between gap-4 p-3 rounded-xl"
        style={{ background: 'oklch(0 0 0 / 20%)', border: '1px solid oklch(1 0 0 / 6%)' }}
      >
        <span className="text-xs text-muted-foreground">Analysis Confidence</span>
        <div className="flex items-center gap-3">
          <div
            className="w-32 h-1.5 rounded-full overflow-hidden"
            style={{ background: 'oklch(1 0 0 / 8%)' }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'var(--accent-cyan)', boxShadow: '0 0 6px oklch(0.720 0.140 200 / 50%)' }}
              initial={{ width: 0 }}
              animate={{ width: `${investigation.confidence}%` }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </div>
          <span
            className="text-sm font-bold tabular-nums min-w-8 text-right"
            style={{ color: 'var(--accent-cyan)' }}
          >
            {investigation.confidence}%
          </span>
        </div>
      </div>
    </div>
  );
}
