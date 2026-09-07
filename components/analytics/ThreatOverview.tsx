'use client';

import { Card } from '@/components/ui/card';
import type { ThreatOverview } from '@/lib/types';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, XCircle, Activity } from 'lucide-react';

interface ThreatOverviewProps {
  overview: ThreatOverview;
}

const riskLevelConfig = {
  critical: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: XCircle },
  high: { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', icon: AlertTriangle },
  medium: { color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', icon: AlertTriangle },
  low: { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', icon: Shield },
  safe: { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', icon: CheckCircle },
};

const verdictConfig = {
  malicious: { label: 'MALICIOUS', color: 'text-red-700 bg-red-100' },
  suspicious: { label: 'SUSPICIOUS', color: 'text-orange-700 bg-orange-100' },
  caution: { label: 'CAUTION', color: 'text-yellow-700 bg-yellow-100' },
  likely_safe: { label: 'LIKELY SAFE', color: 'text-blue-700 bg-blue-100' },
  safe: { label: 'SAFE', color: 'text-green-700 bg-green-100' },
};

export function ThreatOverview({ overview }: ThreatOverviewProps) {
  const config = riskLevelConfig[overview.riskLevel];
  const RiskIcon = config.icon;
  const verdictConfigItem = verdictConfig[overview.verdict];

  const scorePercentage = overview.safetyScore;
  const gaugeColor = scorePercentage >= 80 ? '#22c55e' : 
                    scorePercentage >= 60 ? '#eab308' : 
                    scorePercentage >= 40 ? '#f97316' : '#ef4444';

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="h-5 w-5 text-gray-600" />
        <h2 className="text-lg font-semibold">Threat Overview</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Level & Verdict */}
        <div className="space-y-4">
          <div className={`p-4 rounded-lg border-2 ${config.bg} ${config.border}`}>
            <div className="flex items-center gap-3 mb-2">
              <RiskIcon className={`h-6 w-6 ${config.color}`} />
              <div>
                <div className="text-sm text-gray-600">Risk Level</div>
                <div className={`text-xl font-bold ${config.color} uppercase`}>
                  {overview.riskLevel}
                </div>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-lg ${verdictConfigItem.color}`}>
            <div className="text-sm font-medium opacity-80">Verdict</div>
            <div className="text-lg font-bold">{verdictConfigItem.label}</div>
          </div>
        </div>

        {/* Safety Score Gauge */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={gaugeColor}
                strokeWidth="8"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: scorePercentage / 100 }}
                transition={{ duration: 1, delay: 0.2 }}
                style={{
                  strokeDasharray: '283',
                  strokeDashoffset: 283 * (1 - scorePercentage / 100),
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                className="text-4xl font-bold"
                style={{ color: gaugeColor }}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {overview.safetyScore}
              </motion.div>
              <div className="text-xs text-gray-500">/ 100</div>
            </div>
          </div>
          <div className="text-sm text-gray-600 mt-2">Safety Score</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <StatItem label="Confidence" value={`${overview.confidence}%`} />
        <StatItem label="URLs Found" value={overview.urlCount} />
        <StatItem label="Attachments" value={overview.attachmentCount} />
        <StatItem label="Threat Indicators" value={overview.threatIndicatorCount} />
      </div>

      {/* Additional Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t">
        <DetailItem 
          label="Attack Type" 
          value={overview.attackType.replace('_', ' ').toUpperCase()} 
        />
        <DetailItem 
          label="Phishing Classification" 
          value={overview.phishingClassification.replace('_', ' ').toUpperCase()} 
        />
        <DetailItem 
          label="Social Engineering" 
          value={overview.socialEngineeringDetected ? 'DETECTED' : 'NOT DETECTED'}
          valueColor={overview.socialEngineeringDetected ? 'text-orange-600' : 'text-green-600'}
        />
        <DetailItem 
          label="Reputation Checks" 
          value={overview.reputationCheckCount.toString()} 
        />
      </div>
    </Card>
  );
}

function StatItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="text-center p-3 bg-gray-50 rounded-lg">
      <div className="text-2xl font-bold text-gray-900">{value.toString()}</div>
      <div className="text-xs text-gray-600 mt-1">{label}</div>
    </div>
  );
}

function DetailItem({ 
  label, 
  value, 
  valueColor = 'text-gray-900' 
}: { 
  label: string; 
  value: string | number; 
  valueColor?: string;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-600">{label}</span>
      <span className={`text-sm font-medium ${valueColor}`}>{value.toString()}</span>
    </div>
  );
}
