import React, { useMemo, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Challenge } from '@/data/challenges';
import { getDistrictCoordinates, JHARKHAND_MAP_CENTER } from '@/data/jharkhand-geo';
import { SamadhanColors, Radius } from '@/constants/samadhan-theme';

interface Props {
  challenges: Challenge[];
  onSelect?: (id: string) => void;
  selectedId?: string;
  height?: number;
}

export function ChallengeMapView({ challenges, onSelect, selectedId, height = 420 }: Props) {
  const points = useMemo(() => {
    return challenges.map((c) => {
      const coords = getDistrictCoordinates(c.district);
      return {
        id: c.id,
        title: c.title.replace(/'/g, '’'),
        domain: c.domain,
        color: c.domainColor,
        district: c.district,
        lat: coords.latitude,
        lng: coords.longitude,
        selected: c.id === selectedId,
      };
    });
  }, [challenges, selectedId]);

  const html = useMemo(() => {
    return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    html, body, #map { height: 100%; margin: 0; padding: 0; background: #e2e8f0; }
    .leaflet-control-attribution { font-size: 9px; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    const points = ${JSON.stringify(points)};
    const map = L.map('map', { zoomControl: true }).setView([${JHARKHAND_MAP_CENTER.latitude}, ${JHARKHAND_MAP_CENTER.longitude}], 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap'
    }).addTo(map);

    points.forEach((p) => {
      const size = p.selected ? 20 : 14;
      const icon = L.divIcon({
        className: '',
        html: '<div style="cursor:pointer;width:' + size + 'px;height:' + size + 'px;border-radius:50%;background:' + p.color + ';border:2px solid #fff;box-shadow:0 1px 5px rgba(0,0,0,.45)"></div>',
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
      });
      const marker = L.marker([p.lat, p.lng], { icon }).addTo(map);
      marker.bindPopup('<b>' + p.district + '</b><br/>' + p.title);
      marker.on('click', function () {
        window.parent.postMessage(JSON.stringify({ type: 'SAMVAD_MAP_PIN', id: p.id }), '*');
      });
    });
  </script>
</body>
</html>`;
  }, [points]);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data && data.type === 'SAMVAD_MAP_PIN' && data.id && onSelect) {
          onSelect(data.id);
        }
      } catch {
        // ignore
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [onSelect]);

  return (
    <View style={[styles.wrap, { height }]}>
      <iframe
        srcDoc={html}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          backgroundColor: '#E2E8F0',
        }}
        title="Jharkhand Challenge Map"
      />
      <View style={styles.legend}>
        <Text style={styles.legendText}>Jharkhand challenge map · tap a pin</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    backgroundColor: '#E2E8F0',
    position: 'relative',
  },
  legend: {
    position: 'absolute',
    left: 8,
    bottom: 8,
    backgroundColor: 'rgba(15,23,42,0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    pointerEvents: 'none',
  },
  legendText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
});
export default ChallengeMapView;
