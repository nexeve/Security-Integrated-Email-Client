'use client';

import Link from 'next/link';
import { EmailCategory } from '@/lib/types';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEmailAction } from '@/lib/api/emails';

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

const categoryConfig: Record<EmailCategory, { label: string; color: string; bg: string }> = {
  normal:     { label: 'Normal',    color: 'var(--muted-foreground)', bg: 'oklch(1 0 0 / 6%)' },
  spam:       { label: 'Spam',      color: 'var(--warning)',          bg: 'oklch(0.72 0.16 75 / 10%)' },
  promotional:{ label: 'Promo',     color: 'var(--accent-cyan)',      bg: 'oklch(0.72 0.14 200 / 10%)' },
  malicious:  { label: 'Malicious', color: 'var(--danger)',           bg: 'oklch(0.62 0.22 25 / 12%)' },
  suspicious: { label: 'Suspicious',color: 'var(--warning)',          bg: 'oklch(0.72 0.16 75 / 10%)' },
};

function getScoreStyle(score: number): { color: string; bg: string; border: string; glow: string } {
  if (score >= 80) return {
    color: 'var(--safe)',
    bg:    'oklch(0.66 0.155 145 / 10%)',
    border:'oklch(0.66 0.155 145 / 25%)',
    glow:  '0 0 8px oklch(0.66 0.155 145 / 20%)',
  };
  if (score >= 60) return {
    color: 'var(--warning)',
    bg:    'oklch(0.72 0.16 75 / 10%)',
    border:'oklch(0.72 0.16 75 / 25%)',
    glow:  '0 0 8px oklch(0.72 0.16 75 / 20%)',
  };
  if (score >= 40) return {
    color: 'oklch(0.72 0.18 45)',
    bg:    'oklch(0.72 0.18 45 / 10%)',
    border:'oklch(0.72 0.18 45 / 25%)',
    glow:  '0 0 8px oklch(0.72 0.18 45 / 20%)',
  };
  return {
    color: 'var(--danger)',
    bg:    'oklch(0.62 0.22 25 / 10%)',
    border:'oklch(0.62 0.22 25 / 25%)',
    glow:  '0 0 8px oklch(0.62 0.22 25 / 20%)',
  };
}

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
  const scoreStyle  = getScoreStyle(safetyScore);
  const catConfig   = categoryConfig[category];
  const { mutate: performAction } = useEmailAction();

  const handleStarClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    performAction({ id, action: starred ? 'unstar' : 'star' });
  };

  return (
    <Link href={`/email/${id}`} className="block">
      <motion.div
        className="relative flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors duration-150"
        style={{
          borderBottom: '1px solid oklch(1 0 0 / 5%)',
          background: unread ? 'oklch(1 0 0 / 2%)' : 'transparent',
        }}
        whileHover={{ x: 2 }}
        transition={{ duration: 0.15 }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = 'oklch(1 0 0 / 4%)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = unread
            ? 'oklch(1 0 0 / 2%)'
            : 'transparent';
        }}
      >
        {/* Unread indicator */}
        {unread && (
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 rounded-r-full"
            style={{ background: 'var(--accent-cyan)' }}
          />
        )}

        {/* Star */}
        <button
          className="p-1 rounded transition-colors flex-shrink-0 relative z-10"
          onClick={handleStarClick}
          aria-label={starred ? 'Unstar email' : 'Star email'}
        >
          <Star
            className="h-3.5 w-3.5 transition-colors"
            style={{
              fill:   starred ? 'var(--warning)' : 'transparent',
              color:  starred ? 'var(--warning)' : 'var(--muted-foreground)',
            }}
          />
        </button>

        {/* Sender */}
        <div className="w-40 flex-shrink-0 min-w-0">
          <div
            className="text-sm truncate"
            style={{
              color:      unread ? 'var(--foreground)' : 'var(--muted-foreground)',
              fontWeight: unread ? 600 : 400,
            }}
          >
            {from.name}
          </div>
        </div>

        {/* Subject + preview */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="text-sm truncate"
              style={{
                color:      unread ? 'var(--foreground)' : 'oklch(0.75 0.010 250)',
                fontWeight: unread ? 600 : 400,
              }}
            >
              {subject}
            </span>
            {category !== 'normal' && (
              <span
                className="text-xs px-1.5 py-0.5 rounded-md flex-shrink-0 font-medium"
                style={{ color: catConfig.color, background: catConfig.bg }}
              >
                {catConfig.label}
              </span>
            )}
          </div>
          <div className="text-xs truncate mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            {preview}
          </div>
        </div>

        {/* Safety Score pill */}
        <div
          className="px-2.5 py-1 rounded-lg text-xs font-bold tabular-nums flex-shrink-0"
          style={{
            color:      scoreStyle.color,
            background: scoreStyle.bg,
            border:     `1px solid ${scoreStyle.border}`,
            boxShadow:  scoreStyle.glow,
            minWidth:   '2.5rem',
            textAlign:  'center',
          }}
        >
          {safetyScore}
        </div>

        {/* Date */}
        <div className="w-16 text-right flex-shrink-0">
          <div className="text-xs tabular-nums" style={{ color: 'var(--muted-foreground)' }}>
            {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
