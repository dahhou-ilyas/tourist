type Coordinates = number[] | [number, number][][] | number[][];
type MultiPolyline = Array<Array<[number, number]>>
type Line = Array<[number,number]>

interface LocationFormData {
    city: string;
    neighborhood: string;
    locationType: 'Point' | 'LineString' | 'Polygon';
    coordinates: Coordinates;
    riskLevel: 'low' | 'medium' | 'high';
    description: string;
}