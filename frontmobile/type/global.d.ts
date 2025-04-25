interface GeoPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

interface GeoLineString {
  type: 'LineString';
  coordinates: [number, number][]; // [[lon1, lat1], [lon2, lat2], ...]
}

interface GeoPolygon {
  type: 'Polygon';
  coordinates: [number, number][][]; // [[[lon1, lat1], [lon2, lat2], ...]]
}

type GeoLocation = GeoPoint | GeoLineString | GeoPolygon;


interface LocationData {
    _id: string;
    city: string;
    neighborhood: string;
    location: GeoLocation;
    riskLevel: 'low' | 'medium' | 'high';
    description: string;
    distanceFromUser?: number;

}