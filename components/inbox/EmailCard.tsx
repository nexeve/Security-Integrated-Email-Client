import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmailCategory } from '@/lib/types';

interface EmailCardProps {
  id: string;
  from: { name: string; email: string };
  subject: string;
  date: Date;
  preview: string;
  safetyScore: number;
  category: EmailCategory;
}

const categoryColors: Record<EmailCategory, string> = {
  normal: 'bg-green-500/10 text-green-700 border-green-500/20',
  spam: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
  promotional: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
  malicious: 'bg-red-500/10 text-red-700 border-red-500/20',
  suspicious: 'bg-orange-500/10 text-orange-700 border-orange-500/20',
};

const scoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  if (score >= 40) return 'text-orange-600';
  return 'text-red-600';
};

export function EmailCard({
  id,
  from,
  subject,
  date,
  preview,
  safetyScore,
  category,
}: EmailCardProps) {
  return (
    <Link href={`/email/${id}`}>
      <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm">{from.name}</span>
              <span className="text-xs text-gray-500">&lt;{from.email}&gt;</span>
            </div>
            <div className="text-sm font-medium text-gray-900">{subject}</div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={categoryColors[category]} variant="outline">
              {category}
            </Badge>
            <div className={`text-2xl font-bold ${scoreColor(safetyScore)}`}>
              {safetyScore}
            </div>
          </div>
        </div>
        <div className="text-xs text-gray-500 mb-2">
          {new Date(date).toLocaleDateString()} at {new Date(date).toLocaleTimeString()}
        </div>
        <div className="text-sm text-gray-600 line-clamp-2">{preview}</div>
      </Card>
    </Link>
  );
}
