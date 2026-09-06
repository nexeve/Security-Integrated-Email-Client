'use client';

import React from 'react';
import { useEmail } from '@/lib/api/emails';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { SecurityAnalytics } from '@/components/analytics/SecurityAnalytics';
import { AnalysisLoading } from '@/components/shared/AnalysisLoading';

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

  if (!resolved) {
    return (
      <MainLayout>
        <div className="p-6">
          <div className="text-center text-gray-500">Loading...</div>
        </div>
      </MainLayout>
    );
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="p-6">
          <div className="text-center text-gray-500">Loading email...</div>
        </div>
      </MainLayout>
    );
  }

  if (error || !emailData) {
    return (
      <MainLayout>
        <div className="p-6">
          <div className="text-center text-red-600">Error loading email</div>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Back
          </button>
        </div>
      </MainLayout>
    );
  }

  const { email, analysis } = emailData;

  return (
    <MainLayout>
      <div className="h-full flex flex-col">
        <div className="flex items-center gap-4 px-6 py-3 border-b bg-gray-50">
          <button
            onClick={handleBackToEmail}
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
          >
            ← Back to Email
          </button>
          <div className="flex-1"></div>
          <button
            onClick={() => router.push('/')}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Back to Inbox
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-6">
          {showLoading ? (
            <AnalysisLoading />
          ) : (
            <SecurityAnalytics
              analysis={analysis}
              senderEmail={email.headers.from.email}
              senderName={email.headers.from.name}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
}
