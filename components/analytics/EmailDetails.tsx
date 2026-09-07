'use client';

import { Card } from '@/components/ui/card';
import { RawEmail } from '@/lib/types';
import { Mail, User, Reply, FileText } from 'lucide-react';

interface EmailDetailsProps {
  email: RawEmail;
}

export function EmailDetails({ email }: EmailDetailsProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Mail className="h-5 w-5 text-gray-600" />
        <h2 className="text-lg font-semibold">Email Details</h2>
      </div>

      <div className="space-y-4">
        <DetailRow
          icon={User}
          label="Sender"
          value={`${email.headers.from.name} <${email.headers.from.email}>`}
        />
        
        <DetailRow
          icon={User}
          label="Recipient"
          value={email.headers.to.map(t => `${t.name} <${t.email}>`).join(', ')}
        />
        
        {email.headers.cc && email.headers.cc.length > 0 && (
          <DetailRow
            icon={User}
            label="CC"
            value={email.headers.cc.map(t => `${t.name} <${t.email}>`).join(', ')}
          />
        )}
        
        {email.headers.returnPath && (
          <DetailRow
            icon={Reply}
            label="Reply-To"
            value={email.headers.returnPath}
          />
        )}
        
        <DetailRow
          icon={FileText}
          label="Subject"
          value={email.headers.subject}
        />
      </div>
    </Card>
  );
}

function DetailRow({ 
  icon: Icon, 
  label, 
  value 
}: { 
  icon: any; 
  label: string; 
  value: string; 
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-sm text-gray-600 mb-1">{label}</div>
        <div className="text-sm font-medium text-gray-900 break-words">{value}</div>
      </div>
    </div>
  );
}
