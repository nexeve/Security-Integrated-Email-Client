'use client';

import { useEmails } from '@/lib/api/emails';
import { MainLayout } from '@/components/layout/MainLayout';
import { EmailRow } from '@/components/inbox/EmailRow';

export default function InboxPage() {
  const { data: emails, isLoading, error } = useEmails();

  if (isLoading) {
    return (
      <MainLayout>
        <div className="p-6">
          <div className="text-center text-gray-500">Loading emails...</div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="p-6">
          <div className="text-center text-red-600">Error loading emails</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6">
        <div className="mb-4">
          <h1 className="text-xl font-semibold text-gray-900">Inbox</h1>
          <p className="text-sm text-gray-500">
            {emails?.length || 0} messages
          </p>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-gray-50 border-b text-xs font-medium text-gray-500">
            <div className="col-span-1"></div>
            <div className="col-span-4">From</div>
            <div className="col-span-5">Subject</div>
            <div className="col-span-1 text-center">Score</div>
            <div className="col-span-1 text-right">Date</div>
          </div>
          
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
              unread={Math.random() > 0.5}
              starred={Math.random() > 0.8}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
