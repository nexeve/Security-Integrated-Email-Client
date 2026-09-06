import { RawEmail } from '@/lib/types';
import { Reply, Forward, Archive, Trash2, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SafetyScoreBadge } from './SafetyScoreBadge';

interface EmailViewProps {
  email: RawEmail;
  safetyScore: number;
  onAnalyticsClick: () => void;
}

export function EmailView({ email, safetyScore, onAnalyticsClick }: EmailViewProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Email Header */}
      <div className="border-b p-6">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-2xl font-semibold text-gray-900 flex-1 mr-4">
            {email.headers.subject}
          </h1>
          <SafetyScoreBadge score={safetyScore} onClick={onAnalyticsClick} />
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              {email.headers.from.name.charAt(0)}
            </div>
            <div>
              <div className="font-medium text-gray-900">{email.headers.from.name}</div>
              <div className="text-gray-500">{email.headers.from.email}</div>
            </div>
          </div>
          <div className="flex-1"></div>
          <div className="text-gray-500">
            {new Date(email.headers.date).toLocaleString()}
          </div>
        </div>

        <div className="mt-3 text-sm text-gray-500">
          <span className="font-medium">To:</span> {email.headers.to.map(t => t.email).join(', ')}
          {email.headers.cc && (
            <span className="ml-4">
              <span className="font-medium">Cc:</span> {email.headers.cc.map(t => t.email).join(', ')}
            </span>
          )}
        </div>
      </div>

      {/* Email Actions */}
      <div className="border-b px-6 py-3 flex items-center gap-2">
        <Button variant="ghost" size="sm" className="gap-2">
          <Reply className="h-4 w-4" />
          Reply
        </Button>
        <Button variant="ghost" size="sm" className="gap-2">
          <Forward className="h-4 w-4" />
          Forward
        </Button>
        <Button variant="ghost" size="sm" className="gap-2">
          <Archive className="h-4 w-4" />
          Archive
        </Button>
        <Button variant="ghost" size="sm" className="gap-2 text-red-600 hover:text-red-700">
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
        <div className="flex-1"></div>
        <Button variant="ghost" size="sm">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      {/* Email Body */}
      <div className="flex-1 overflow-auto p-6">
        <div className="prose prose-sm max-w-none">
          {email.body.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-3 text-gray-700 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {email.attachments && email.attachments.length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Attachments ({email.attachments.length})
            </h3>
            <div className="space-y-2">
              {email.attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <div className="text-2xl">📎</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {attachment.filename}
                    </div>
                    <div className="text-xs text-gray-500">
                      {(attachment.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
