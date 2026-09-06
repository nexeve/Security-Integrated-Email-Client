import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThreatIndicator } from '@/lib/types';

interface ThreatIndicatorsProps {
  threats: ThreatIndicator[];
}

const severityColors: Record<ThreatIndicator['severity'], string> = {
  critical: 'bg-red-500/10 text-red-700 border-red-500/20',
  high: 'bg-orange-500/10 text-orange-700 border-orange-500/20',
  medium: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
  low: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
};

export function ThreatIndicators({ threats }: ThreatIndicatorsProps) {
  if (threats.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Threat Indicators</h3>
        <p className="text-green-600">No threats detected</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">
        Threat Indicators ({threats.length})
      </h3>
      <div className="space-y-3">
        {threats.map((threat, index) => (
          <div
            key={index}
            className="border rounded-lg p-3 bg-gray-50"
          >
            <div className="flex items-start justify-between mb-2">
              <Badge className={severityColors[threat.severity]} variant="outline">
                {threat.type}
              </Badge>
              <Badge className={severityColors[threat.severity]} variant="outline">
                {threat.severity}
              </Badge>
            </div>
            <p className="text-sm text-gray-700">{threat.description}</p>
            {threat.evidence && (
              <p className="text-xs text-gray-500 mt-2 italic">
                Evidence: {threat.evidence}
              </p>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
