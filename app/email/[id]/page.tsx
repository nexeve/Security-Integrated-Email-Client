'use client';

import React from 'react';
import { useEmail } from '@/lib/api/emails';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { EmailView } from '@/components/email-view/EmailView';
import { ChevronLeft, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EmailDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [id, setId] = React.useState<string | null>(null);
  const [resolved, setResolved] = React.useState(false);

  React.useEffect(() => {
    params.then(p => {
      setId(p.id);
      setResolved(true);
    });
  }, [params]);

  const { data: emailData, isLoading, error } = useEmail(id || '');

  const handleAnalyticsClick = () => {
    if (id) router.push(`/email/${id}/analytics`);
  };

  const LoadingState = (
    <MainLayout>
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        >
          <RefreshCw className="h-7 w-7" style={{ color: 'var(--accent-cyan)' }} />
        </motion.div>
        <p className="text-sm text-muted-foreground">Loading email…</p>
      </div>
    </MainLayout>
  );

  if (!resolved || isLoading) return LoadingState;

  if (error || !emailData) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <p className="text-sm font-medium" style={{ color: 'var(--danger)' }}>
            Unable to load email
          </p>
          <button
            onClick={() => router.push('/')}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors underline-offset-2 hover:underline"
          >
            Go back
          </button>
        </div>
      </MainLayout>
    );
  }

  const { email, analysis } = emailData;

  return (
    <MainLayout>
      <div className="h-full flex flex-col">
        {/* Breadcrumb bar */}
        <div
          className="flex items-center gap-3 px-5 py-2.5 flex-shrink-0"
          style={{
            background: 'oklch(0 0 0 / 15%)',
            borderBottom: '1px solid oklch(1 0 0 / 6%)',
          }}
        >
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-1.5 text-sm transition-colors text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            Inbox
          </button>
        </div>

        <EmailView
          email={email}
          safetyScore={analysis.safetyScore}
          onAnalyticsClick={handleAnalyticsClick}
        />
      </div>
    </MainLayout>
  );
}
