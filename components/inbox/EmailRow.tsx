'use client';

import Link from 'next/link';
import { EmailCategory } from '@/lib/types';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmailRowProps {
  id: string;
  from: { name: string; email: string };
  subject: string;
  date: Date;
  preview: string;
  safetyScore: number;
  category: EmailCategory;
  unread?: boolean;
  starred?: boolean;
}

const categoryLabels: Record<EmailCategory, string> = {
  normal: 'Normal',
  spam: 'Spam',
  promotional: 'Promo',
  malicious: 'Malicious',
  suspicious: 'Suspicious',
};

const categoryBadgeColors: Record<EmailCategory, string> = {
  normal: 'bg-gray-100 text-gray-700',
  spam: 'bg-yellow-100 text-yellow-800',
  promotional: 'bg-blue-100 text-blue-800',
  malicious: 'bg-red-100 text-red-800',
  suspicious: 'bg-orange-100 text-orange-800',
};

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  if (score >= 40) return 'text-orange-600';
  return 'text-red-600';
};

const getScoreBg = (score: number) => {
  if (score >= 80) return 'bg-green-50';
  if (score >= 60) return 'bg-yellow-50';
  if (score >= 40) return 'bg-orange-50';
  return 'bg-red-50';
};

export function EmailRow({
  id,
  from,
  subject,
  date,
  preview,
  safetyScore,
  category,
  unread = false,
  starred = false,
}: EmailRowProps) {
  return (
    <Link href={`/email/${id}`}>
      <motion.div
        className="flex items-center gap-4 px-4 py-3 border-b hover:bg-gray-50 transition-colors cursor-pointer group"
        whileHover={{ x: 4 }}
        transition={{ duration: 0.2 }}
      >
        {/* Star */}
        <button
          className="p-1 hover:bg-gray-200 rounded transition-colors"
          onClick={(e) => e.preventDefault()}
        >
          <Star
            className={`h-4 w-4 ${starred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        </button>

        {/* Sender */}
        <div className="w-48 flex-shrink-0">
          <div className={`text-sm truncate ${unread ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
            {from.name}
          </div>
        </div>

        {/* Subject */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`text-sm truncate ${unread ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
              {subject}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${categoryBadgeColors[category]}`}>
              {categoryLabels[category]}
            </span>
          </div>
          <div className="text-xs text-gray-500 truncate mt-0.5">{preview}</div>
        </div>

        {/* Safety Score */}
        <div className={`px-3 py-1 rounded-lg text-sm font-semibold ${getScoreBg(safetyScore)} ${getScoreColor(safetyScore)} flex-shrink-0`}>
          {safetyScore}
        </div>

        {/* Date */}
        <div className="w-20 text-right flex-shrink-0">
          <div className="text-xs text-gray-500">
            {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
