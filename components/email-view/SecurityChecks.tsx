import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SecurityCheckResult, SecurityCheckStatus } from '@/lib/types';

interface SecurityChecksProps {
  spf: SecurityCheckResult;
  dkim: SecurityCheckResult;
  dmarc: SecurityCheckResult;
}

const statusColors: Record<SecurityCheckStatus, string> = {
  pass: 'bg-green-500/10 text-green-700 border-green-500/20',
  fail: 'bg-red-500/10 text-red-700 border-red-500/20',
  neutral: 'bg-gray-500/10 text-gray-700 border-gray-500/20',
  unknown: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
};

const statusIcons: Record<SecurityCheckStatus, string> = {
  pass: '✓',
  fail: '✗',
  neutral: '○',
  unknown: '?',
};

export function SecurityChecks({ spf, dkim, dmarc }: SecurityChecksProps) {
  const checks = [
    { name: 'SPF', result: spf, description: 'Sender Policy Framework' },
    { name: 'DKIM', result: dkim, description: 'DomainKeys Identified Mail' },
    { name: 'DMARC', result: dmarc, description: 'Domain-based Message Authentication' },
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Security Checks</h3>
      <div className="space-y-4">
        {checks.map((check) => (
          <div
            key={check.name}
            className="flex items-start justify-between p-3 border rounded-lg bg-gray-50"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold">{check.name}</span>
                <span className="text-xs text-gray-500">{check.description}</span>
              </div>
              <p className="text-sm text-gray-600">{check.result.details}</p>
              {check.result.domain && (
                <p className="text-xs text-gray-500 mt-1">
                  Domain: {check.result.domain}
                </p>
              )}
            </div>
            <Badge className={statusColors[check.result.status]} variant="outline">
              <span className="mr-1">{statusIcons[check.result.status]}</span>
              {check.result.status}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}
