'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { OriginAnalysis } from '@/lib/types';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapComponentProps {
  origin: OriginAnalysis;
}

function MapBounds({ origin }: { origin: OriginAnalysis }) {
  const map = useMap();

  useEffect(() => {
    if (origin.relayPath.length === 0) return;

    const validPoints = origin.relayPath
      .filter(hop => hop.location?.latitude && hop.location?.longitude)
      .map(hop => [hop.location!.latitude!, hop.location!.longitude!] as [number, number]);

    if (validPoints.length === 0) return;

    const bounds = L.latLngBounds(validPoints);
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [48, 48] });
    }
  }, [map, origin]);

  return null;
}

export default function MapComponent({ origin }: MapComponentProps) {

  const validHops = origin.relayPath.filter(
    hop => hop.location?.latitude && hop.location?.longitude
  );

  if (validHops.length === 0) {
    return (
      <div
        className="h-80 flex flex-col items-center justify-center gap-2 rounded-lg"
        style={{ background: 'oklch(0 0 0 / 20%)' }}
      >
        <p className="text-sm font-medium text-foreground">No geographic data</p>
        <p className="text-xs text-muted-foreground">Relay hops do not have location information</p>
      </div>
    );
  }

  const positions: [number, number][] = validHops.map(hop => [
    hop.location!.latitude!,
    hop.location!.longitude!,
  ]);

  // Create custom div icons (no external image URLs)
  const createMarkerIcon = (isOrigin: boolean) =>
    L.divIcon({
      className: '',
      html: `
        <div style="
          width: 18px; height: 18px;
          border-radius: 50%;
          background: ${isOrigin ? 'oklch(0.62 0.22 25)' : 'oklch(0.720 0.140 200)'};
          border: 2.5px solid oklch(1 0 0 / 80%);
          box-shadow: 0 0 10px ${isOrigin ? 'oklch(0.62 0.22 25 / 60%)' : 'oklch(0.720 0.140 200 / 60%)'}, 0 2px 4px oklch(0 0 0 / 50%);
        "></div>
      `,
      iconSize:   [18, 18],
      iconAnchor: [9, 9],
    });

  return (
    <div style={{ height: '320px' }}>
      <MapContainer
        center={[validHops[0].location!.latitude!, validHops[0].location!.longitude!]}
        zoom={3}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
        zoomControl={true}
      >
        {/* CartoDB Dark Matter — matches the dark forensic aesthetic */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={19}
        />

        <MapBounds origin={origin} />

        {/* Relay path polyline */}
        {positions.length > 1 && (
          <Polyline
            positions={positions}
            color="oklch(0.720 0.140 200)"
            weight={2.5}
            opacity={0.75}
            dashArray="6, 10"
          />
        )}

        {/* Hop markers */}
        {validHops.map((hop) => {
          const isOrigin = hop.role === 'earliest_origin';
          const icon = createMarkerIcon(isOrigin);

          return (
            <Marker
              key={hop.hopNumber}
              position={[hop.location!.latitude!, hop.location!.longitude!]}
              icon={icon}
            >
              <Popup className="dark-popup">
                <div
                  style={{
                    background:  'oklch(0.160 0.022 258)',
                    border:      '1px solid oklch(1 0 0 / 12%)',
                    borderRadius: '8px',
                    padding:     '10px 12px',
                    minWidth:    '180px',
                    color:       'oklch(0.90 0.008 240)',
                    fontSize:    '12px',
                    lineHeight:  '1.5',
                  }}
                >
                  <div style={{ fontWeight: 700, marginBottom: '6px', color: 'oklch(0.720 0.140 200)' }}>
                    Hop {hop.hopNumber}{isOrigin ? ' · ORIGIN' : ''}
                  </div>
                  <div><strong>IP:</strong> {hop.ip}</div>
                  {hop.hostname  && <div><strong>Host:</strong> {hop.hostname}</div>}
                  {hop.provider  && <div><strong>ISP:</strong> {hop.provider}</div>}
                  <div><strong>Location:</strong> {hop.location?.city || '—'}, {hop.location?.country || '—'}</div>
                  <div><strong>Confidence:</strong> {hop.confidence}</div>
                  {hop.timestamp && (
                    <div style={{ color: 'oklch(0.60 0.015 252)', marginTop: '4px', fontSize: '11px' }}>
                      {new Date(hop.timestamp).toLocaleString()}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
