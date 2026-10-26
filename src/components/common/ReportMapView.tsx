import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import type { CivicReport } from '@/data/samadhan-mock-data';
import { getDistrictCoordinates, JHARKHAND_MAP_CENTER } from '@/data/jharkhand-geo';
import { SamadhanColors, Radius } from '@/constants/samadhan-theme';

interface Props {
  reports: CivicReport[];
  onSelect?: (id: string) => void;
  selectedId?: string;
  height?: number;
}

const STATUS_COLORS: Record<string, string> = {
  Received: '#3B82F6',
  Validated: '#F59E0B',
  Assigned: '#6366F1',
  'In Progress': '#8B5CF6',
  Pilot: '#EC4899',
  Deployed: '#10B981',
  Resolved: '#10B981',
  Closed: '#6B7280',
};

export function ReportMapView({ reports, onSelect, selectedId, height = 380 }: Props) {
  const html = useMemo(() => {
    const points = reports.map((r) => {
      let lat = r.location?.latitude;
      let lng = r.location?.longitude;

      if (!lat || !lng || isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) {
        const fallback = getDistrictCoordinates(r.location?.district || 'Ranchi');
        lat = fallback.latitude + (Math.random() - 0.5) * 0.05;
        lng = fallback.longitude + (Math.random() - 0.5) * 0.05;
      }

      const color = STATUS_COLORS[r.status] || '#3B82F6';

      return {
        id: r.id,
        title: (r.titleEn || 'Report').replace(/'/g, '’'),
        district: r.location?.district || 'Jharkhand',
        village: r.location?.villageOrWard || '',
        status: r.status,
        color,
        lat,
        lng,
        selected: r.id === selectedId,
      };
    });

    return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    html, body, #map { height: 100%; margin: 0; padding: 0; background: #e2e8f0; }
    .leaflet-control-attribution { font-size: 9px; }
    .report-popup { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 12px; }
    .report-badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 10px; color: #fff; margin-bottom: 4px; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    const points = ${JSON.stringify(points)};
    const map = L.map('map', { zoomControl: true }).setView([${JHARKHAND_MAP_CENTER.latitude}, ${JHARKHAND_MAP_CENTER.longitude}], 8);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap'
    }).addTo(map);

    points.forEach((p) => {
      const size = p.selected ? 20 : 15;
      const icon = L.divIcon({
        className: '',
        html: '<div style="width:' + size + 'px;height:' + size + 'px;border-radius:50%;background:' + p.color + ';border:2px solid #fff;box-shadow:0 1px 5px rgba(0,0,0,.45)"></div>',
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
      });
      const marker = L.marker([p.lat, p.lng], { icon }).addTo(map);
      marker.bindPopup('<div class="report-popup"><span class="report-badge" style="background:' + p.color + '">' + p.status + '</span><br/><b>' + p.district + (p.village ? ' (' + p.village + ')' : '') + '</b><br/>' + p.title + '</div>');
      marker.on('click', function () {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ id: p.id }));
        }
      });
    });

    if (points.length > 0) {
      const group = new L.featureGroup(points.map(p => L.marker([p.lat, p.lng])));
      map.fitBounds(group.getBounds().pad(0.2));
    }
  </script>
</body>
</html>`;
  }, [reports, selectedId]);

  return (
    <View style={[styles.wrap, { height }]}>
      <WebView
        originWhitelist={['*']}
        source={{ html, baseUrl: 'https://unpkg.com' }}
        style={styles.webview}
        domStorageEnabled
        javaScriptEnabled
        mixedContentMode="always"
        scrollEnabled={false}
        onMessage={(event) => {
          try {
            const payload = JSON.parse(event.nativeEvent.data) as { id?: string };
            if (payload.id && onSelect) onSelect(payload.id);
          } catch {}
        }}
      />
      <View style={styles.legend}>
        <Text style={styles.legendText}>📍 Showing {reports.length} reported issues on map</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    position: 'relative',
  },
  webview: {
    flex: 1,
    backgroundColor: '#E2E8F0',
  },
  legend: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: Radius.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  legendText: {
    fontSize: 11,
    fontWeight: '700',
    color: SamadhanColors.textSecondary,
  },
});
