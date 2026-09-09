'use client';

import { Shield, AlertTriangle, CheckCircle, XCircle, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface SafetyScoreBadgeProps {
  score: number;
  onClick: () => void;
}

function getScoreConfig(score: number) {
  if (score >= 80) return {
    color:  'var(--safe)',
    border: 'oklch(0.66 0.155 145 / 30%)',
    glow:   '0 0 16px oklch(0.66 0.155 145 / 25%), 0 0 4px oklch(0.66 0.155 145 / 15%)',
    bg:     'oklch(0.66 0.155 145 / 8%)',
    label:  'Safe',
    Icon:   CheckCircle,
  };
  if (score >= 60) return {
    color:  'var(--warning)',
    border: 'oklch(0.72 0.16 75 / 30%)',
    glow:   '0 0 16px oklch(0.72 0.16 75 / 25%), 0 0 4px oklch(0.72 0.16 75 / 15%)',
    bg:     'oklch(0.72 0.16 75 / 8%)',
    label:  'Moderate',
    Icon:   Shield,
  };
  if (score >= 40) return {
    color:  'oklch(0.72 0.18 45)',
    border: 'oklch(0.72 0.18 45 / 30%)',
    glow:   '0 0 16px oklch(0.72 0.18 45 / 25%), 0 0 4px oklch(0.72 0.18 45 / 15%)',
    bg:     'oklch(0.72 0.18 45 / 8%)',
    label:  'Caution',
    Icon:   AlertTriangle,
  };
  return {
    color:  'var(--danger)',
    border: 'oklch(0.62 0.22 25 / 30%)',
    glow:   '0 0 16px oklch(0.62 0.22 25 / 30%), 0 0 4px oklch(0.62 0.22 25 / 20%)',
    bg:     'oklch(0.62 0.22 25 / 10%)',
    label:  'Dangerous',
    Icon:   XCircle,
  };
}

export function SafetyScoreBadge({ score, onClick }: SafetyScoreBadgeProps) {
  const config = getScoreConfig(score);
  const { Icon } = config;

  return (
    <motion.button
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer select-none flex-shrink-0"
      style={{
        background:  config.bg,
        border:      `1px solid ${config.border}`,
        boxShadow:   config.glow,
        color:       config.color,
      }}
      title="Click for detailed security analysis"
      aria-label={`Security score: ${score} out of 100. ${config.label}. Click to view full analysis.`}
      whileHover={{ scale: 1.02, boxShadow: config.glow.replace('25%', '35%').replace('15%', '25%') }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15 }}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />

      <div className="text-left">
        <div className="text-xs font-semibold uppercase tracking-widest opacity-80">
          {config.label}
        </div>
        <div className="flex items-baseline gap-1">
          <motion.span
            className="text-3xl font-bold leading-none tabular-nums"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {score}
          </motion.span>
          <span className="text-xs opacity-60 font-medium">/ 100</span>
        </div>
      </div>

      <div className="flex flex-col items-center ml-1">
        <BarChart2 className="h-3.5 w-3.5 opacity-50" />
        <span className="text-xs opacity-60 mt-0.5 whitespace-nowrap">Analysis</span>
      </div>
    </motion.button>
  );
}
