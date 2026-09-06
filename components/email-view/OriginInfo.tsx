import { Card } from '@/components/ui/card';
import { GeolocationInfo } from '@/lib/types';

interface OriginInfoProps {
  geolocation: GeolocationInfo;
  senderEmail: string;
  senderName: string;
}

export function OriginInfo({ geolocation, senderEmail, senderName }: OriginInfoProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Origin Information</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 border rounded-lg bg-gray-50">
          <span className="text-sm font-medium text-gray-600">Sender</span>
          <span className="text-sm">{senderName}</span>
        </div>
        <div className="flex justify-between items-center p-3 border rounded-lg bg-gray-50">
          <span className="text-sm font-medium text-gray-600">Email</span>
          <span className="text-sm">{senderEmail}</span>
        </div>
        <div className="flex justify-between items-center p-3 border rounded-lg bg-gray-50">
          <span className="text-sm font-medium text-gray-600">IP Address</span>
          <span className="text-sm font-mono">{geolocation.ip}</span>
        </div>
        <div className="flex justify-between items-center p-3 border rounded-lg bg-gray-50">
          <span className="text-sm font-medium text-gray-600">Country</span>
          <span className="text-sm">{geolocation.country}</span>
        </div>
        {geolocation.city && (
          <div className="flex justify-between items-center p-3 border rounded-lg bg-gray-50">
            <span className="text-sm font-medium text-gray-600">City</span>
            <span className="text-sm">{geolocation.city}</span>
          </div>
        )}
        {geolocation.region && (
          <div className="flex justify-between items-center p-3 border rounded-lg bg-gray-50">
            <span className="text-sm font-medium text-gray-600">Region</span>
            <span className="text-sm">{geolocation.region}</span>
          </div>
        )}
        {geolocation.isp && (
          <div className="flex justify-between items-center p-3 border rounded-lg bg-gray-50">
            <span className="text-sm font-medium text-gray-600">ISP</span>
            <span className="text-sm">{geolocation.isp}</span>
          </div>
        )}
        <div className="flex justify-between items-center p-3 border rounded-lg bg-gray-50">
          <span className="text-sm font-medium text-gray-600">Accuracy</span>
          <span className="text-sm capitalize">{geolocation.accuracy}</span>
        </div>
      </div>
    </Card>
  );
}
