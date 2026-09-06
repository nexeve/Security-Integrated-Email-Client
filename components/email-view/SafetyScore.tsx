'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface SafetyScoreProps {
  score: number;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  if (score >= 40) return 'text-orange-600';
  return 'text-red-600';
};

const getScoreLabel = (score: number) => {
  if (score >= 80) return 'Safe';
  if (score >= 60) return 'Moderate Risk';
  if (score >= 40) return 'High Risk';
  return 'Dangerous';
};

const getScoreBgColor = (score: number) => {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-yellow-500';
  if (score >= 40) return 'bg-orange-500';
  return 'bg-red-500';
};

export function SafetyScore({ score }: SafetyScoreProps) {
  const scoreColor = getScoreColor(score);
  const scoreLabel = getScoreLabel(score);
  const scoreBgColor = getScoreBgColor(score);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Safety Score</h3>
        <Badge className={scoreColor} variant="outline">
          {scoreLabel}
        </Badge>
      </div>
      <div className="flex items-center gap-4">
        <motion.div
          className={`text-5xl font-bold ${scoreColor}`}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {score}
        </motion.div>
        <div className="flex-1">
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${scoreBgColor}`}
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">0-100 Scale</div>
        </div>
      </div>
    </Card>
  );
}
