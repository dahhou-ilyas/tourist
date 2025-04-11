import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents,Polyline } from 'react-leaflet';
import MapSearchComponent from './MapSearchCoponent';
import L from 'leaflet';

type MultiPolyline = [number, number][][];
interface MapComponentProps {
    onSelect: (coordinates: number[]) => void;
    locationType : boolean
}
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

const MapSelector: React.FC<MapComponentProps> = ({ onSelect ,locationType}) => {
    const [position, setPosition] = useState<[number, number] | null>(null);
  
    
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        onSelect([lng, lat]);
      },
    });
  
    return position ? <Marker position={position} /> : null;
};

const MapSelectLign: React.FC<boolean> = ({isPoint}) => {
  const isDragging = useRef(false);
  const [initPoint,setInitPoint]=useState<MultiPolyline>([])
  const [ligne , setLigne]= useState<Array<[number,number]>>([]);

  
  useMapEvents({
    mousedown(e) {
      if(isPoint){
        return;
      }
      isDragging.current = true;
      const { lat, lng } = e.latlng;
      setInitPoint([lat,lng])
      setLigne(prev=>[...prev,[lat,lng]])
      console.log('🟢 Drag start at:', e.latlng);
    },
    mousemove(e) {
      if(isPoint){
        return;
      }
      if (isDragging.current) {
        const { lat, lng } = e.latlng;
        setLigne(prev=>[...prev,[lat,lng]])
        console.log('🟡 Dragging at:', e.latlng);
        // 👉 Tu peux ici mettre à jour une position, dessiner, etc.
      }
    },
    mouseup(e) {
      if(isPoint){
        return;
      }
      if (isDragging.current) {
        isDragging.current = false;
        const { lat, lng } = e.latlng;
        setLigne(prev=>[...prev,[lat,lng]])
        setLigne([])
        console.log('🔴 Drag end at:', e.latlng);
        // 👉 Action finale après drag (ex: enregistrer la zone)
      }
    },
  });

  if(ligne){
    return <Polyline positions = {ligne}/>
  }

  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({ onSelect,locationType }) => {
  const mapRef = useRef<L.Map | null>(null);

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
        <MapSelector onSelect={onSelect} locationType ={locationType} />
        <MapSelectLign isPoint={locationType}/>
        <UpdateDragging dragging={locationType} mapRef={mapRef} />
      </MapContainer>
    );
  };
  
  export default MapComponent;