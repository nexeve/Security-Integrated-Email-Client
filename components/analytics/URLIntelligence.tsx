'use client';

import { Card } from '@/components/ui/card';
import { URLIntelligenceItem } from '@/lib/types';
import { Link, Shield, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';

interface URLIntelligenceProps {
  urls: URLIntelligenceItem[];
}

const reputationConfig = {
  malicious: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  suspicious: { icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
  unknown: { icon: HelpCircle, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' },
  safe: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
};

export function URLIntelligence({ urls }: URLIntelligenceProps) {
  if (urls.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Link className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold">URL Intelligence</h2>
        </div>
        <div className="text-center text-gray-500 py-8">
          No URLs detected in this email
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Link className="h-5 w-5 text-gray-600" />
        <h2 className="text-lg font-semibold">URL Intelligence</h2>
        <span className="ml-auto text-sm text-gray-500">{urls.length} URLs found</span>
      </div>

      <div className="space-y-3">
        {urls.map((urlItem, index) => {
          const config = reputationConfig[urlItem.reputation];
          const ReputationIcon = config.icon;

          return (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 ${config.bg} ${config.border}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <ReputationIcon className={`h-4 w-4 ${config.color} flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 break-all">
                      {urlItem.url}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {urlItem.domain}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 ml-4">
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${config.color} ${config.bg}`}>
                    {urlItem.reputation.toUpperCase()}
                  </span>
                  <div className="text-xs text-gray-500">
                    Risk: {urlItem.riskScore}/100
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mt-3 pt-3 border-t border-gray-200">
                <div>
                  <span className="font-medium">Status:</span> {urlItem.status}
                </div>
                {urlItem.threatType && (
                  <div>
                    <span className="font-medium">Threat Type:</span> {urlItem.threatType}
                  </div>
                )}
                {urlItem.firstSeen && (
                  <div>
                    <span className="font-medium">First Seen:</span>{' '}
                    {new Date(urlItem.firstSeen).toLocaleDateString()}
                  </div>
                )}
                {urlItem.lastSeen && (
                  <div>
                    <span className="font-medium">Last Seen:</span>{' '}
                    {new Date(urlItem.lastSeen).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
