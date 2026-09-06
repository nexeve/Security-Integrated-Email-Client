import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface SafetyScoreBadgeProps {
  score: number;
  onClick: () => void;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  if (score >= 40) return 'text-orange-600';
  return 'text-red-600';
};

const getScoreBg = (score: number) => {
  if (score >= 80) return 'bg-green-50 border-green-200';
  if (score >= 60) return 'bg-yellow-50 border-yellow-200';
  if (score >= 40) return 'bg-orange-50 border-orange-200';
  return 'bg-red-50 border-red-200';
};

const getScoreIcon = (score: number) => {
  if (score >= 80) return CheckCircle;
  if (score >= 60) return Shield;
  if (score >= 40) return AlertTriangle;
  return XCircle;
};

const getScoreLabel = (score: number) => {
  if (score >= 80) return 'Safe';
  if (score >= 60) return 'Moderate';
  if (score >= 40) return 'Caution';
  return 'Dangerous';
};

export function SafetyScoreBadge({ score, onClick }: SafetyScoreBadgeProps) {
  const ScoreIcon = getScoreIcon(score);
  const colorClass = getScoreColor(score);
  const bgClass = getScoreBg(score);
  const label = getScoreLabel(score);

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${bgClass} ${colorClass} hover:opacity-80 transition-opacity cursor-pointer`}
      title="Click for detailed security analysis"
    >
      <ScoreIcon className="h-5 w-5" />
      <div className="text-left">
        <div className="text-xs font-medium uppercase tracking-wide">{label}</div>
        <div className="text-2xl font-bold">{score}</div>
      </div>
      <div className="text-xs text-gray-500 ml-2">
        / 100
      </div>
    </button>
  );
}
