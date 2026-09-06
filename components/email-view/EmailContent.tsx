import { Card } from '@/components/ui/card';
import { RawEmail } from '@/lib/types';

interface EmailContentProps {
  email: RawEmail;
}

export function EmailContent({ email }: EmailContentProps) {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{email.headers.subject}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div>
            <span className="font-medium">From:</span> {email.headers.from.name} &lt;{email.headers.from.email}&gt;
          </div>
          <div>
            <span className="font-medium">To:</span> {email.headers.to.map(t => t.email).join(', ')}
          </div>
        </div>
        <div className="text-sm text-gray-500">
          {new Date(email.headers.date).toLocaleString()}
        </div>
      </div>
      
      <div className="border-t pt-4">
        <div className="prose prose-sm max-w-none">
          {email.body.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-2">{paragraph}</p>
          ))}
        </div>
      </div>

      {email.attachments && email.attachments.length > 0 && (
        <div className="border-t mt-4 pt-4">
          <h3 className="text-sm font-semibold mb-2">Attachments</h3>
          <div className="space-y-2">
            {email.attachments.map((attachment, index) => (
              <div key={index} className="text-sm p-2 bg-gray-50 rounded border">
                📎 {attachment.filename} ({(attachment.size / 1024).toFixed(1)} KB)
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
