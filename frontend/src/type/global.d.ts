type Coordinates = number[] | [number, number][][] | number[][];
type MultiPolyline = Array<Array<[number, number]>>
type Line = Array<[number,number]>

type Polygon = Point[];
type Point = [number, number];

interface MapSelectPolygoneRef {
  resetPolygon: () => void;
  getCurrentPolygon: () => Polygon | null;
  setPolygon: (polygon: Polygon) => void;
}

interface LocationFormData {
    city: string;
    neighborhood: string;
    locationType: 'Point' | 'LineString' | 'Polygon';
    coordinates: Coordinates;
    riskLevel: 'low' | 'medium' | 'high';
    description: string;
}

type MapComponentHandle = {
    clearMap: () => void;
};

interface MapComponentProps {
    onSelect: (coordinates: Coordinates) => void;
    locationType : boolean,
    locationNameType: string
}