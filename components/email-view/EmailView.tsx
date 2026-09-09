'use client';

import { RawEmail } from '@/lib/types';
import { Reply, Forward, Archive, Trash2, MoreVertical, Paperclip } from 'lucide-react';
import { SafetyScoreBadge } from './SafetyScoreBadge';
import { SecurityChecks } from './SecurityChecks';
import { ThreatIndicators } from './ThreatIndicators';
import { motion } from 'framer-motion';
import { showPrototypeToast } from '@/lib/utils';
import { useEmailAction } from '@/lib/api/emails';
import { useRouter } from 'next/navigation';
import { EmailHtmlContent } from './EmailHtmlContent';

interface EmailViewProps {
  email: RawEmail;
  safetyScore: number;
  onAnalyticsClick: () => void;
  securityChecks?: {
    spf: import('@/lib/types').SecurityCheckResult;
    dkim: import('@/lib/types').SecurityCheckResult;
    dmarc: import('@/lib/types').SecurityCheckResult;
  };
  threatIndicators?: import('@/lib/types').ThreatIndicator[];
}

export function EmailView({
  email,
  safetyScore,
  onAnalyticsClick,
  securityChecks,
  threatIndicators,
}: EmailViewProps) {
  const router = useRouter();
  const initials = email.headers.from.name.charAt(0).toUpperCase();
  const { mutate: performAction } = useEmailAction();

  const handleArchive = () => {
    performAction({ id: email.id, action: 'archive' }, {
      onSuccess: () => router.push('/')
    });
  };

  const handleTrash = () => {
    performAction({ id: email.id, action: 'trash' }, {
      onSuccess: () => router.push('/')
    });
  };

  return (
    <motion.div
      className="flex flex-col flex-1 overflow-hidden"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Email header area */}
      <div
        className="px-6 md:px-8 pt-8 pb-5 flex-shrink-0"
        style={{ borderBottom: '1px solid oklch(1 0 0 / 6%)' }}
      >
        {/* Subject + Safety Score */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold leading-tight text-foreground tracking-tight flex-1">
            {email.headers.subject}
          </h1>
          <div className="flex-shrink-0 mt-1">
            <SafetyScoreBadge score={safetyScore} onClick={onAnalyticsClick} />
          </div>
        </div>

        {/* Sender row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 select-none"
              style={{
                background: 'linear-gradient(135deg, oklch(0.55 0.16 200), oklch(0.45 0.14 235))',
                color: 'white',
                boxShadow: '0 2px 8px oklch(0.72 0.14 200 / 25%), inset 0 1px 0 oklch(1 0 0 / 20%)',
              }}
            >
              {initials}
            </div>

            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-base text-foreground">{email.headers.from.name}</span>
                <span className="text-sm text-muted-foreground">&lt;{email.headers.from.email}&gt;</span>
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                <span className="font-medium" style={{ color: 'var(--muted-foreground)' }}>To:</span>{' '}
                <span className="text-foreground">{email.headers.to.map(t => t.name || t.email).join(', ')}</span>
                {email.headers.cc && email.headers.cc.length > 0 && (
                  <>
                    <span className="mx-1.5 opacity-50">·</span>
                    <span className="font-medium" style={{ color: 'var(--muted-foreground)' }}>Cc:</span>{' '}
                    <span className="text-foreground">{email.headers.cc.map(t => t.name || t.email).join(', ')}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="text-xs text-muted-foreground whitespace-nowrap text-right flex flex-col justify-between h-full pt-1">
            {new Date(email.headers.date).toLocaleString(undefined, {
              weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
            })}
          </div>
        </div>
      </div>

      {/* Action toolbar */}
      <div
        className="px-6 md:px-8 py-3 flex items-center gap-2 flex-shrink-0"
        style={{
          background: 'oklch(0 0 0 / 20%)',
          borderBottom: '1px solid oklch(1 0 0 / 5%)',
          boxShadow: 'inset 0 -1px 0 oklch(0 0 0 / 40%)',
        }}
      >
        <button className="btn-tactile px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm text-foreground transition-all" onClick={() => showPrototypeToast('Reply not implemented in prototype')}>
          <Reply className="h-4 w-4 text-muted-foreground" />
          Reply
        </button>
        <button className="btn-tactile px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm text-foreground transition-all" onClick={() => showPrototypeToast('Forward not implemented in prototype')}>
          <Forward className="h-4 w-4 text-muted-foreground" />
          Forward
        </button>
        <button className="btn-tactile px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm text-foreground transition-all" onClick={handleArchive}>
          <Archive className="h-4 w-4 text-muted-foreground" />
          Archive
        </button>
        <div className="w-px h-5 bg-border mx-1 opacity-50" />
        <button
          className="btn-tactile px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm transition-all"
          style={{ color: 'var(--danger)' }}
          onClick={handleTrash}
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
        <div className="flex-1" />
        <button className="btn-tactile p-1.5 rounded-lg text-muted-foreground transition-all hover:text-foreground" onClick={() => showPrototypeToast('More options not implemented in prototype')}>
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      {/* Email body */}
      <div className="flex-1 overflow-auto bg-black/20">
        <div className="max-w-3xl mx-auto px-6 md:px-8 py-8 md:py-10">
          {email.htmlBody ? (
            <EmailHtmlContent html={email.htmlBody} />
          ) : (
            <div 
              className="text-[15px] leading-relaxed tracking-[0.01em] space-y-4 whitespace-pre-wrap break-words"
              style={{ color: 'oklch(0.85 0.01 245)' }}
            >
              {email.body}
            </div>
          )}

        {/* Attachments */}
        {email.attachments && email.attachments.length > 0 && (
          <div className="mt-6 pt-5" style={{ borderTop: '1px solid oklch(1 0 0 / 6%)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Paperclip className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium text-foreground">
                Attachments ({email.attachments.length})
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {email.attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-colors"
                  style={{
                    background: 'var(--surface-2)',
                    border: '1px solid oklch(1 0 0 / 8%)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'var(--surface-3)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'var(--surface-2)';
                  }}
                >
                  <div className="text-lg">📎</div>
                  <div>
                    <div className="text-xs font-medium text-foreground">{attachment.filename}</div>
                    <div className="text-xs text-muted-foreground">
                      {(attachment.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inline security summary (if provided) */}
        {securityChecks && (
          <div className="mt-6">
            <SecurityChecks
              spf={securityChecks.spf}
              dkim={securityChecks.dkim}
              dmarc={securityChecks.dmarc}
            />
          </div>
        )}

        {threatIndicators && threatIndicators.length > 0 && (
          <div className="mt-8 pt-6 border-t border-border/10">
            <h3 className="text-sm font-medium text-foreground mb-4">Security Indicators</h3>
            <ThreatIndicators threats={threatIndicators} />
          </div>
        )}
        </div>
      </div>
    </motion.div>
  );
}
