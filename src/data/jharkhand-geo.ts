export const JHARKHAND_MAP_CENTER = {
  latitude: 23.61,
  longitude: 85.28,
};

export const DISTRICT_COORDINATES: Record<string, { latitude: number; longitude: number }> = {
  Ranchi: { latitude: 23.3441, longitude: 85.3096 },
  Dhanbad: { latitude: 23.7957, longitude: 86.4304 },
  Jamshedpur: { latitude: 22.8046, longitude: 86.2029 },
  Bokaro: { latitude: 23.6693, longitude: 86.1511 },
  Hazaribagh: { latitude: 23.9924, longitude: 85.3616 },
  Deoghar: { latitude: 24.4828, longitude: 86.6947 },
  Palamu: { latitude: 24.042, longitude: 84.069 },
  Giridih: { latitude: 24.185, longitude: 86.3 },
  Khunti: { latitude: 23.075, longitude: 85.279 },
  Dumka: { latitude: 24.268, longitude: 87.249 },
  'West Singhbhum': { latitude: 22.556, longitude: 85.807 },
  'East Singhbhum': { latitude: 22.8046, longitude: 86.2029 },
  Latehar: { latitude: 23.744, longitude: 84.5 },
  Simdega: { latitude: 22.615, longitude: 84.502 },
  Gumla: { latitude: 23.043, longitude: 84.542 },
  Lohardaga: { latitude: 23.433, longitude: 84.68 },
  Chatra: { latitude: 24.206, longitude: 84.87 },
  Koderma: { latitude: 24.468, longitude: 85.594 },
  Seraikela: { latitude: 22.7, longitude: 86.0 },
  Godda: { latitude: 24.827, longitude: 87.217 },
  Sahibganj: { latitude: 25.242, longitude: 87.634 },
  Pakur: { latitude: 24.636, longitude: 87.849 },
  Jamtara: { latitude: 23.963, longitude: 86.803 },
  Ramgarh: { latitude: 23.63, longitude: 85.519 },
};

export function getDistrictCoordinates(district: string) {
  return DISTRICT_COORDINATES[district] ?? JHARKHAND_MAP_CENTER;
}
