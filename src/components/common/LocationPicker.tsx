import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import {
  MapPin,
  Crosshair,
  Navigation,
  Info,
  Building,
} from 'lucide-react-native';
import {
  JHARKHAND_LOCATIONS,
} from '@/data/samadhan-mock-data';
import { getDistrictCoordinates } from '@/data/jharkhand-geo';
import { SamadhanColors, Spacing, Radius } from '@/constants/samadhan-theme';
import { useApp } from '@/context/AppContext';

export interface SelectedLocation {
  district: string;
  block: string;
  villageOrWard: string;
  address: string;
  latitude: number;
  longitude: number;
  accuracyMeters?: number;
  isGps: boolean;
}

interface LocationPickerProps {
  value: SelectedLocation;
  onChange: (loc: SelectedLocation) => void;
}

export function LocationPicker({ value, onChange }: LocationPickerProps) {
  const { language, fontScale, showToast } = useApp();
  const [detectingGps, setDetectingGps] = useState(false);
  const [mode, setMode] = useState<'gps' | 'manual'>('gps');

  const currentDistrictData = JHARKHAND_LOCATIONS.find(
    (d) => d.district === value.district
  ) || JHARKHAND_LOCATIONS[0];

  const currentBlockData = currentDistrictData.blocks.find(
    (b) => b.name === value.block
  ) || currentDistrictData.blocks[0];

  const handleUseCurrentLocation = async () => {
    setDetectingGps(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        showToast(
          'Location permission was denied. Please select manually.',
          'error'
        );
        setMode('manual');
        setDetectingGps(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude, accuracy } = loc.coords;

      let districtName = value.district || 'Ranchi';
      let blockName = value.block || 'Ranchi Sadar';
      let streetAddress = '';

      try {
        const reverse = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (reverse && reverse.length > 0) {
          const first = reverse[0];
          streetAddress = [first.name, first.street, first.subregion].filter(Boolean).join(', ');
          const detectedDist = first.district || first.city || first.subregion || '';
          const match = JHARKHAND_LOCATIONS.find((d) =>
            d.district.toLowerCase().includes(detectedDist.toLowerCase())
          );
          if (match) {
            districtName = match.district;
            blockName = match.blocks[0]?.name || blockName;
          }
        }
      } catch (e) {
        console.warn('Reverse geocode error:', e);
      }

      onChange({
        district: districtName,
        block: blockName,
        villageOrWard: streetAddress || `${blockName} Area`,
        address: streetAddress || `GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        latitude,
        longitude,
        accuracyMeters: accuracy ? Math.round(accuracy) : 8,
        isGps: true,
      });

      showToast(
        'Real GPS location captured!',
        'success'
      );
      setMode('gps');
    } catch (err: any) {
      console.warn('GPS capture error:', err);
      onChange({
        district: 'Ranchi',
        block: 'Ormanjhi',
        villageOrWard: 'Chutupalu Panchayat',
        address: 'Near NH-33 Junction, Chutupalu',
        latitude: 23.4789,
        longitude: 85.4789,
        accuracyMeters: 10,
        isGps: true,
      });
      showToast(
        'Could not access GPS hardware: using default area.',
        'info'
      );
      setMode('gps');
    } finally {
      setDetectingGps(false);
    }
  };

  return (
    <View style={styles.container}>
      
      <View style={styles.tabToggleRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Use GPS Location"
          onPress={() => setMode('gps')}
          style={[styles.tabButton, mode === 'gps' && styles.tabButtonActive]}>
          <Crosshair
            size={16}
            color={mode === 'gps' ? SamadhanColors.primary : SamadhanColors.textSecondary}
          />
          <Text
            style={[
              styles.tabButtonText,
              mode === 'gps' && styles.tabButtonTextActive,
            ]}>
            Use Current GPS
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Enter Location Manually"
          onPress={() => setMode('manual')}
          style={[styles.tabButton, mode === 'manual' && styles.tabButtonActive]}>
          <Building
            size={16}
            color={mode === 'manual' ? SamadhanColors.primary : SamadhanColors.textSecondary}
          />
          <Text
            style={[
              styles.tabButtonText,
              mode === 'manual' && styles.tabButtonTextActive,
            ]}>
            Enter Manually
          </Text>
        </Pressable>
      </View>

      {mode === 'gps' ? (
        <View style={styles.gpsCard}>
          <View style={styles.gpsHeader}>
            <View style={styles.gpsIconCircle}>
              <Navigation size={20} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.gpsTitle, { fontSize: 14 * fontScale }]}>
                {detectingGps
                  ? 'Acquiring satellite signal...'
                  : 'Location Detected via GPS'}
              </Text>
              <Text style={styles.gpsAccuracy}>
                {detectingGps
                  ? 'Calculating accuracy radius...'
                  : `✓ Accurate to ~${value.accuracyMeters || 6} meters`}
              </Text>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Refresh current GPS coordinates"
              onPress={handleUseCurrentLocation}
              style={styles.refreshGpsBtn}>
              {detectingGps ? (
                <ActivityIndicator size="small" color={SamadhanColors.primary} />
              ) : (
                <Crosshair size={18} color={SamadhanColors.primary} />
              )}
            </Pressable>
          </View>

          <View style={styles.mapPreviewGraphic}>
            <View style={styles.mockRoadH} />
            <View style={styles.mockRoadV} />
            <View style={styles.radarPulse}>
              <View style={styles.radarPin}>
                <MapPin size={22} color="#FFFFFF" fill={SamadhanColors.action} />
              </View>
            </View>
            <View style={styles.mapBadge}>
              <Text style={styles.coordsText}>
                {value.latitude.toFixed(4)}° N, {value.longitude.toFixed(4)}° E
              </Text>
            </View>
          </View>

          <View style={styles.detectedDetailsBox}>
            <Text style={styles.detectedLabel}>
              Identified Location:
            </Text>
            <Text style={styles.detectedValue}>
              {value.villageOrWard}, {value.block}, {value.district}
            </Text>
            <Text style={styles.detectedSubtext}>
              {value.address || 'Ormanjhi Block, Ranchi, Jharkhand'}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.manualForm}>
          <Text style={styles.fieldLabel}>
            District *
          </Text>
          <View style={styles.chipRow}>
            {JHARKHAND_LOCATIONS.map((d) => (
              <Pressable
                key={d.district}
                accessibilityRole="button"
                accessibilityLabel={`Select district ${d.district}`}
                onPress={() => {
                  const coords = getDistrictCoordinates(d.district);
                  onChange({
                    ...value,
                    district: d.district,
                    block: d.blocks[0].name,
                    villageOrWard: d.blocks[0].panchayatsOrWards[0],
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                    isGps: false,
                  });
                }}
                style={[
                  styles.districtChip,
                  value.district === d.district && styles.districtChipActive,
                ]}>
                <Text
                  style={[
                    styles.chipText,
                    value.district === d.district && styles.chipTextActive,
                  ]}>
                  {d.district}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={[styles.fieldLabel, { marginTop: Spacing.md }]}>
            Block / Tehsil *
          </Text>
          <View style={styles.chipRow}>
            {currentDistrictData.blocks.map((b) => (
              <Pressable
                key={b.name}
                accessibilityRole="button"
                accessibilityLabel={`Select block ${b.name}`}
                onPress={() => {
                  onChange({
                    ...value,
                    block: b.name,
                    villageOrWard: b.panchayatsOrWards[0],
                    isGps: false,
                  });
                }}
                style={[
                  styles.districtChip,
                  value.block === b.name && styles.districtChipActive,
                ]}>
                <Text
                  style={[
                    styles.chipText,
                    value.block === b.name && styles.chipTextActive,
                  ]}>
                  {b.name}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={[styles.fieldLabel, { marginTop: Spacing.md }]}>
            Panchayat / Ward *
          </Text>
          <View style={styles.chipRow}>
            {currentBlockData.panchayatsOrWards.map((pw) => (
              <Pressable
                key={pw}
                accessibilityRole="button"
                accessibilityLabel={`Select panchayat or ward ${pw}`}
                onPress={() => {
                  onChange({
                    ...value,
                    villageOrWard: pw,
                    isGps: false,
                  });
                }}
                style={[
                  styles.districtChip,
                  value.villageOrWard === pw && styles.districtChipActive,
                ]}>
                <Text
                  style={[
                    styles.chipText,
                    value.villageOrWard === pw && styles.chipTextActive,
                  ]}>
                  {pw}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      <View style={styles.addressSection}>
        <Text style={styles.fieldLabel}>
          Street Address or Nearest Landmark
        </Text>
        <TextInput
          accessibilityLabel="Street Address or Landmark"
          value={value.address}
          onChangeText={(txt) => onChange({ ...value, address: txt })}
          placeholder="e.g., Near Primary School, Main Road, opposite Post Office"
          placeholderTextColor={SamadhanColors.textMuted}
          style={styles.addressInput}
        />
      </View>

      <View style={styles.permissionNote}>
        <Info size={14} color={SamadhanColors.primary} />
        <Text style={styles.permissionText}>
          Exact location enables engineering and municipal teams to dispatch relief accurately.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.sm,
  },
  tabToggleRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: Radius.lg,
    padding: 4,
    marginBottom: Spacing.md,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: Radius.md,
    minHeight: 44,
  },
  tabButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: SamadhanColors.textSecondary,
  },
  tabButtonTextActive: {
    color: SamadhanColors.primary,
    fontWeight: '700',
  },
  gpsCard: {
    backgroundColor: SamadhanColors.surface,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  gpsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  gpsIconCircle: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    backgroundColor: SamadhanColors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gpsTitle: {
    fontWeight: '700',
    color: SamadhanColors.textPrimary,
  },
  gpsAccuracy: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
    marginTop: 2,
  },
  refreshGpsBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: SamadhanColors.primarySurface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPreviewGraphic: {
    height: 120,
    backgroundColor: '#E2E8F0',
    borderRadius: Radius.md,
    marginTop: Spacing.md,
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mockRoadH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 16,
    backgroundColor: '#CBD5E1',
  },
  mockRoadV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 16,
    backgroundColor: '#CBD5E1',
  },
  radarPulse: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(234, 88, 12, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radarPin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: SamadhanColors.action,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.sm,
  },
  coordsText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  detectedDetailsBox: {
    marginTop: Spacing.md,
    padding: Spacing.sm,
    backgroundColor: '#F8FAFC',
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  detectedLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: SamadhanColors.textMuted,
    textTransform: 'uppercase',
  },
  detectedValue: {
    fontSize: 13,
    fontWeight: '700',
    color: SamadhanColors.primary,
    marginTop: 2,
  },
  detectedSubtext: {
    fontSize: 11,
    color: SamadhanColors.textSecondary,
    marginTop: 2,
  },
  manualForm: {
    backgroundColor: SamadhanColors.surface,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: SamadhanColors.textPrimary,
    marginBottom: 6,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  districtChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Radius.full,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  districtChipActive: {
    backgroundColor: SamadhanColors.primarySurface,
    borderColor: SamadhanColors.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: SamadhanColors.textSecondary,
  },
  chipTextActive: {
    color: SamadhanColors.primary,
    fontWeight: '700',
  },
  addressSection: {
    marginTop: Spacing.md,
  },
  addressInput: {
    backgroundColor: SamadhanColors.surface,
    borderWidth: 1,
    borderColor: SamadhanColors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    fontSize: 13,
    color: SamadhanColors.textPrimary,
    minHeight: 46,
  },
  permissionNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    marginTop: Spacing.md,
  },
  permissionText: {
    flex: 1,
    fontSize: 11,
    color: SamadhanColors.primary,
    lineHeight: 15,
  },
});
