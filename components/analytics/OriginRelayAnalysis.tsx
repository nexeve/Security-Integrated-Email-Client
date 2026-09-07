'use client';

import { Card } from '@/components/ui/card';
import { OriginAnalysis } from '@/lib/types';
import { Globe, MapPin, Network, ArrowRight } from 'lucide-react';

interface OriginRelayAnalysisProps {
  origin: OriginAnalysis;
}

export function OriginRelayAnalysis({ origin }: OriginRelayAnalysisProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Globe className="h-5 w-5 text-gray-600" />
        <h2 className="text-lg font-semibold">Origin / Mail Relay Analysis</h2>
      </div>

      {/* Key Origin Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <OriginDetail
          icon={MapPin}
          label="Earliest Reliable IP"
          value={origin.earliestReliableIP}
        />
        <OriginDetail
          icon={Network}
          label="Confidence"
          value={origin.confidence.toUpperCase()}
          valueColor={origin.confidence === 'high' ? 'text-green-600' : 
                    origin.confidence === 'medium' ? 'text-yellow-600' : 'text-red-600'}
        />
        <OriginDetail
          icon={Globe}
          label="Sender Domain"
          value={origin.senderDomain}
        />
        <OriginDetail
          icon={Globe}
          label="Reply-To Domain"
          value={origin.replyToDomain}
        />
      </div>

      {/* Earliest Origin */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="text-sm font-medium text-blue-900 mb-2">Earliest Origin</div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-600">IP:</span>{' '}
            <span className="font-medium">{origin.earliestOrigin.ip}</span>
          </div>
          <div>
            <span className="text-gray-600">Provider:</span>{' '}
            <span className="font-medium">{origin.earliestOrigin.provider || 'Unknown'}</span>
          </div>
          <div>
            <span className="text-gray-600">Country:</span>{' '}
            <span className="font-medium">{origin.earliestOrigin.location.country}</span>
          </div>
          {origin.earliestOrigin.location.city && (
            <div>
              <span className="text-gray-600">City:</span>{' '}
              <span className="font-medium">{origin.earliestOrigin.location.city}</span>
            </div>
          )}
        </div>
      </div>

      {/* Relay Path */}
      <div>
        <div className="text-sm font-medium text-gray-900 mb-3">
          Mail Relay Path ({origin.totalHops} hops)
        </div>
        <div className="space-y-2">
          {origin.relayPath.map((hop, index) => (
            <div key={hop.hopNumber} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  hop.hopNumber === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}>
                  {hop.hopNumber}
                </div>
                {index < origin.relayPath.length - 1 && (
                  <div className="w-0.5 h-8 bg-gray-300 my-1" />
                )}
              </div>
              
              <div className="flex-1 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    {hop.hostname || hop.ip}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    hop.confidence === 'high' ? 'bg-green-100 text-green-700' :
                    hop.confidence === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {hop.confidence}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div>
                    <span>IP:</span> {hop.ip}
                  </div>
                  {hop.provider && (
                    <div>
                      <span>Provider:</span> {hop.provider}
                    </div>
                  )}
                  <div>
                    <span>Country:</span> {hop.location?.country || 'Unknown'}
                  </div>
                  {hop.location?.city && (
                    <div>
                      <span>City:</span> {hop.location.city}
                    </div>
                  )}
                </div>
                
                {hop.timestamp && (
                  <div className="text-xs text-gray-500 mt-2">
                    {new Date(hop.timestamp).toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function OriginDetail({ 
  icon: Icon, 
  label, 
  value, 
  valueColor = 'text-gray-900' 
}: { 
  icon: any; 
  label: string; 
  value: string; 
  valueColor?: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <Icon className="h-4 w-4 text-gray-500 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-xs text-gray-600">{label}</div>
        <div className={`text-sm font-medium truncate ${valueColor}`}>{value}</div>
      </div>
    </div>
  );
}
