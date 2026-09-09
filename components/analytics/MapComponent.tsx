'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { OriginAnalysis } from '@/lib/types';

// Import Leaflet only on client side
let L: any = null;

if (typeof window !== 'undefined') {
  L = require('leaflet');
}

interface MapComponentProps {
  origin: OriginAnalysis;
}

function MapBounds({ origin }: { origin: OriginAnalysis }) {
  const map = useMap();

  useEffect(() => {
    if (origin.relayPath.length === 0 || !L) return;

    const bounds = L.latLngBounds(
      origin.relayPath
        .filter(hop => hop.location?.latitude && hop.location?.longitude)
        .map(hop => [hop.location!.latitude!, hop.location!.longitude!])
    );

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, origin, L]);

  return null;
}

export default function MapComponent({ origin }: MapComponentProps) {
  const [isClient, setIsClient] = useState(false);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Load Leaflet CSS dynamically
    const loadCss = () => {
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        link.onload = () => setLeafletLoaded(true);
        document.head.appendChild(link);
      } else {
        setLeafletLoaded(true);
      }
    };

    loadCss();
  }, []);

  if (!isClient || !leafletLoaded) {
    return (
      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        Loading map...
      </div>
    );
  }

  if (!L) {
    return (
      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="font-medium">Map unavailable</p>
          <p className="text-sm mt-1">Failed to load map library</p>
        </div>
      </div>
    );
  }

  // Fix for default marker icons
  if (typeof window !== 'undefined' && L.Icon.Default) {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }

  // Filter hops that have valid coordinates
  const validHops = origin.relayPath.filter(
    hop => hop.location?.latitude && hop.location?.longitude
  );

  if (validHops.length === 0) {
    return (
      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="font-medium">No geographic data available</p>
          <p className="text-sm mt-1">Relay hops do not have location information</p>
        </div>
      </div>
    );
  }

  // Create coordinates for polyline
  const positions: [number, number][] = validHops.map(hop => [
    hop.location!.latitude!,
    hop.location!.longitude!
  ]);

  // Create custom icons
  const createIcon = (color: string) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
  };

  return (
    <div className="h-96 rounded-lg overflow-hidden border border-gray-200">
      <MapContainer
        center={[validHops[0].location!.latitude!, validHops[0].location!.longitude!]}
        zoom={4}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapBounds origin={origin} />

        {/* Draw polyline connecting relay hops */}
        {positions.length > 1 && (
          <Polyline
            positions={positions}
            color="#3b82f6"
            weight={3}
            opacity={0.7}
            dashArray="5, 10"
          />
        )}

        {/* Markers for each relay hop */}
        {validHops.map((hop) => {
          const isOrigin = hop.role === 'earliest_origin';
          const icon = createIcon(isOrigin ? '#ef4444' : '#3b82f6');

          return (
            <Marker
              key={hop.hopNumber}
              position={[hop.location!.latitude!, hop.location!.longitude!]}
              icon={icon}
            >
              <Popup>
                <div className="text-sm">
                  <div className="font-bold mb-1">
                    Hop {hop.hopNumber} {isOrigin && '(Origin)'}
                  </div>
                  <div className="space-y-1">
                    <div><span className="font-medium">IP:</span> {hop.ip}</div>
                    {hop.hostname && <div><span className="font-medium">Hostname:</span> {hop.hostname}</div>}
                    {hop.provider && <div><span className="font-medium">Provider:</span> {hop.provider}</div>}
                    <div><span className="font-medium">Location:</span> {hop.location?.city}, {hop.location?.country}</div>
                    <div><span className="font-medium">Confidence:</span> {hop.confidence}</div>
                    {hop.timestamp && (
                      <div><span className="font-medium">Time:</span> {new Date(hop.timestamp).toLocaleString()}</div>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
