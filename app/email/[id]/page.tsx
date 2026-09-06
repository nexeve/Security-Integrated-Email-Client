'use client';

import React from 'react';
import { useEmail } from '@/lib/api/emails';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { EmailView } from '@/components/email-view/EmailView';

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
    if (id) {
      router.push(`/email/${id}/analytics`);
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
            Back to Inbox
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
            onClick={() => router.back()}
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
          >
            ← Back to Inbox
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
