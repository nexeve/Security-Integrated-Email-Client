'use client';

import React from 'react';
import { useEmail } from '@/lib/api/emails';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { SecurityAnalytics } from '@/components/analytics/SecurityAnalytics';
import { AnalysisLoading } from '@/components/shared/AnalysisLoading';
import { ChevronLeft, RefreshCw, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EmailAnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [id, setId] = React.useState<string | null>(null);
  const [resolved, setResolved] = React.useState(false);
  const [showLoading, setShowLoading] = React.useState(true);

  React.useEffect(() => {
    params.then(p => {
      setId(p.id);
      setResolved(true);
    });
  }, [params]);

  const { data: emailData, isLoading, error } = useEmail(id || '');

  // Simulate analysis loading state
  React.useEffect(() => {
    if (!isLoading && emailData) {
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 1500); // Show loading for 1.5 seconds
      return () => clearTimeout(timer);
    }
  }, [isLoading, emailData]);

  const handleBackToEmail = () => {
    if (id) {
      router.push(`/email/${id}`);
    }
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
        <p className="text-sm text-muted-foreground">Initializing forensics…</p>
      </div>
    </MainLayout>
  );

  if (!resolved || isLoading) return LoadingState;

  if (error || !emailData) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="h-5 w-5" style={{ color: 'var(--danger)' }} />
            <p className="text-sm font-medium" style={{ color: 'var(--danger)' }}>
              Forensic data unavailable
            </p>
          </div>
          <button
            onClick={handleBackToEmail}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors underline-offset-2 hover:underline"
          >
            Return to email
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
          className="flex items-center gap-4 px-5 py-2.5 flex-shrink-0"
          style={{
            background: 'oklch(0 0 0 / 15%)',
            borderBottom: '1px solid oklch(1 0 0 / 6%)',
          }}
        >
          <button
            onClick={handleBackToEmail}
            className="flex items-center gap-1.5 text-sm transition-colors text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Email
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-4 md:p-6">
          {showLoading ? (
            <AnalysisLoading />
          ) : (
            <SecurityAnalytics
              analysis={analysis}
              email={email}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
}
