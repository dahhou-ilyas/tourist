import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents,Polyline } from 'react-leaflet';
import L from 'leaflet';
import MapSelectPolygone from './MapSelectPolygone';


type UpdateDraggingProps = {
  dragging: boolean;
  mapRef: React.MutableRefObject<L.Map | null>;
};

const UpdateDragging: React.FC<UpdateDraggingProps> = ({ dragging, mapRef }) => {
  useEffect(() => {
    if (mapRef.current) {
      if (dragging) {
        mapRef.current.dragging.enable();
      } else {
        mapRef.current.dragging.disable();
      }
    }
  }, [dragging, mapRef]);

  return null;
};

const MapSelectorPoint: React.FC<MapComponentProps> = ({ onSelect ,locationType,locationNameType}) => {

    const [position, setPosition] = useState<[number, number] | null>(null);
  
    const [points , setPoints] = useState<[number, number][]>([]);

    useEffect(()=>{
        setPoints([])
      
    },[locationNameType])

    useEffect(()=>{
      onSelect(points);
    },[points])

    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPoints(prev=>[...prev,[lat, lng]])
        setPosition([lat, lng]);
        
      },
    });

    const handleMarkerClick = (indexToRemove: number) => {
      setPoints((prevPoints) => prevPoints.filter((_, i) => i !== indexToRemove));
    };
  
    return (position && points && locationType) ? points.map((p, index) => <Marker key={index} position={p} eventHandlers={{click: () => handleMarkerClick(index)}}/>) : null;
};


//locationType is un boolean qui permet de vérifier si il est un point ou  (ligne et polygon)
const MapSelectLign: React.FC<MapComponentProps> = ({onSelect,locationNameType}) => {
  const isDragging = useRef(false);
  const startPoint = useRef<[number, number] | null>(null);
  const [currentLine, setCurrentLine] = useState<Line>([]);
  const [allLines, setAllLines] = useState<MultiPolyline>([]);

  useEffect(() => {
    
      setAllLines([]);
  }, [locationNameType]);

  useEffect(()=>{
    onSelect(allLines)
  },[allLines])
  
  useMapEvents({
    mousedown(e) {
      if(locationNameType != "LineString"){
        return;
      }
      isDragging.current = true;
      const { lat, lng } = e.latlng;
      startPoint.current = [lat, lng];
      setCurrentLine([[lat, lng], [lat, lng]]);
      console.log('🟢 Drag start at:', e.latlng);
    },
    mousemove(e) {
      if (locationNameType!="LineString" || !isDragging.current || !startPoint.current) {
        return;
      }
      if (isDragging.current) {
        const { lat, lng } = e.latlng;
        setCurrentLine([startPoint.current, [lat, lng]]);
        console.log('🟡 Dragging at:', e.latlng);
      }
    },
    mouseup(e) {
      if(locationNameType != "LineString"){
        return;
      }
      if (isDragging.current && startPoint.current) {
        isDragging.current = false;
        const { lat, lng } = e.latlng;
        const finalLine : Array<[number, number]> = [startPoint.current, [lat, lng]];
        setAllLines(prev => {
          return [...prev, finalLine]
        });
        setCurrentLine([]);
        startPoint.current = null;
        console.log('🔴 Drag end at:', e.latlng);
      }
    },
  });

    return (
      <>
        {allLines.map((line, index) => (
        <Polyline key={`line-${index}`} positions={line} />
        ))}
        {currentLine.length > 0 && <Polyline positions={currentLine} />}
      </>
    );

};



const MapComponent = forwardRef<MapComponentHandle, MapComponentProps>(({ onSelect, locationType, locationNameType }, ref) => {
  const mapRef = useRef<L.Map | null>(null);

  const mapPolygonRef = useRef<MapSelectPolygoneRef>(null);
  const [userPosition, setUserPosition] = useState<[number, number] | undefined>(undefined);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserPosition([latitude, longitude]);
          
          if (mapRef.current) {
            mapRef.current.setView([latitude, longitude], 15);
          }
        },
        (error) => {
          console.error("Erreur lors de l'obtention de la position:", error);
        }
      );
    } else {
      console.error("La géolocalisation n'est pas supportée par ce navigateur");
    }
  };

  useEffect(()=>{
    getUserLocation();
  },[])

  useImperativeHandle(ref, () => ({
    clearMap: () => {
      if (!mapRef.current) return;
      mapRef.current.eachLayer((layer) => {
        
        if (!(layer instanceof L.TileLayer)) {
          if(layer.options.title!="myPosition"){
            mapRef.current!.removeLayer(layer);
            mapPolygonRef.current?.resetPolygon();
          } 
        }
      });
    }
  }));

    return (
      <MapContainer 
        center={[33.5902, -7.5890]} 
        zoom={13} 
        style={{ height: '400px', width: '100%' }}
        ref={mapRef}
      >
        
        {/* <MapSearchComponent onSelect={onSelect}/> */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {userPosition && <Marker title='myPosition' position={userPosition as [number, number]}/>}
        <MapSelectorPoint onSelect={onSelect} locationType ={locationType} locationNameType={locationNameType}/>
        <MapSelectLign onSelect={onSelect} locationType={locationType} locationNameType={locationNameType}/>
        <MapSelectPolygone ref={mapPolygonRef} onSelect={onSelect} locationType={locationType} locationNameType={locationNameType} />
        <UpdateDragging dragging={locationType} mapRef={mapRef} />
      </MapContainer>
    );
});
  
  export default MapComponent;


//locationType is un boolean qui permet de vérifier si il est un point ou  (ligne et polygon)