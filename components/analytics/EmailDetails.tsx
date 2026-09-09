'use client';

import { RawEmail } from '@/lib/types';
import { Mail, User, Reply, FileText } from 'lucide-react';

interface EmailDetailsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  email: any;
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div
      className="flex items-start gap-3 p-3 rounded-lg"
      style={{ background: 'oklch(0 0 0 / 18%)', border: '1px solid oklch(1 0 0 / 6%)' }}
    >
      <div
        className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: 'oklch(0.720 0.140 200 / 10%)' }}
      >
        <Icon className="h-3.5 w-3.5" style={{ color: 'var(--accent-cyan)' }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-muted-foreground mb-0.5">{label}</div>
        <div className="text-sm text-foreground break-words leading-relaxed">{value}</div>
      </div>
    </div>
  );
}

export function EmailDetails({ email }: EmailDetailsProps) {
  // Handle both RawEmail and plain email shapes
  const headers = email?.headers ?? email;
  const from = headers?.from ?? email?.from;
  const to   = headers?.to   ?? (email?.to ? [{ name: '', email: email.to }] : []);
  const cc   = headers?.cc;
  const returnPath = headers?.returnPath;
  const subject    = headers?.subject ?? email?.subject;

  return (
    <div
      className="rounded-xl p-6"
      style={{
        background: 'var(--surface-1)',
        border:     '1px solid oklch(1 0 0 / 7%)',
        boxShadow:  'inset 0 1px 0 oklch(1 0 0 / 4%)',
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Mail className="h-4 w-4" style={{ color: 'var(--accent-cyan)' }} />
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Email Details
        </h2>
      </div>

      <div className="space-y-2">
        {from && (
          <DetailRow
            icon={User}
            label="Sender"
            value={from.name ? `${from.name} <${from.email}>` : from.email ?? '—'}
          />
        )}

        {to && to.length > 0 && (
          <DetailRow
            icon={User}
            label="Recipient"
            value={to.map((t: { name?: string; email: string }) =>
              t.name ? `${t.name} <${t.email}>` : t.email
            ).join(', ')}
          />
        )}

        {cc && cc.length > 0 && (
          <DetailRow
            icon={User}
            label="CC"
            value={cc.map((t: { name?: string; email: string }) =>
              t.name ? `${t.name} <${t.email}>` : t.email
            ).join(', ')}
          />
        )}

        {returnPath && (
          <DetailRow icon={Reply} label="Reply-To" value={returnPath} />
        )}

        {subject && (
          <DetailRow icon={FileText} label="Subject" value={subject} />
        )}
      </div>
    </div>
  );
}
