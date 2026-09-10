'use client';

import { useEmails } from '@/lib/api/emails';
import { MainLayout } from '@/components/layout/MainLayout';
import { EmailRow } from '@/components/inbox/EmailRow';
import { motion } from 'framer-motion';
import { Inbox, RefreshCw } from 'lucide-react';

import React from 'react';

export default function InboxPage(props: { searchParams: Promise<{ folder?: string }> }) {
  // Unwrap searchParams
  const sp = props.searchParams ? React.use(props.searchParams) : {};
  const folder = sp.folder || 'inbox';

  const { data: emails, isLoading, error } = useEmails(folder);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          >
            <RefreshCw className="h-8 w-8" style={{ color: 'var(--accent-cyan)' }} />
          </motion.div>
          <p className="text-sm text-muted-foreground">Loading inbox…</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <p className="text-sm font-medium" style={{ color: 'var(--danger)' }}>
            Failed to load emails
          </p>
          <p className="text-xs text-muted-foreground">Check your connection and try again.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-5 lg:p-6 max-w-none">
        {/* Page header */}
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'oklch(0.720 0.140 200 / 12%)', border: '1px solid var(--border-accent)' }}
          >
            <Inbox className="h-4 w-4" style={{ color: 'var(--accent-cyan)' }} />
          </div>
          <div>
            <h1 className="text-base font-semibold text-foreground">
              {folder.charAt(0).toUpperCase() + folder.slice(1)}
            </h1>
            <p className="text-xs text-muted-foreground">
              {emails?.length || 0} messages · {emails?.filter(e => e.analysis.safetyScore < 50).length || 0} threats
            </p>
          </div>
        </div>

        {/* Email table */}
        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: 'var(--surface-1)',
            border: '1px solid oklch(1 0 0 / 7%)',
            boxShadow: 'inset 0 1px 0 oklch(1 0 0 / 4%), 0 4px 24px oklch(0 0 0 / 25%)',
          }}
        >
          {/* Column header */}
          <div
            className="grid grid-cols-12 gap-4 px-4 py-2.5 text-xs font-medium uppercase tracking-wide"
            style={{
              background: 'oklch(0 0 0 / 15%)',
              borderBottom: '1px solid oklch(1 0 0 / 6%)',
              color: 'var(--muted-foreground)',
            }}
          >
            <div className="col-span-1" />
            <div className="col-span-3">From</div>
            <div className="col-span-6">Subject</div>
            <div className="col-span-1 text-center">Score</div>
            <div className="col-span-1 text-right">Date</div>
          </div>

          {/* Rows */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {emails?.map((email) => (
              <EmailRow
                key={email.id}
                id={email.id}
                from={email.from}
                subject={email.subject}
                date={email.date}
                preview={email.preview}
                safetyScore={email.analysis.safetyScore}
                category={email.analysis.category}
                unread={email.isUnread}
                starred={email.isStarred}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}
