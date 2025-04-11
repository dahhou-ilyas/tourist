import React, { useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import MapSearchComponent from './MapSearchCoponent';


interface MapComponentProps {
    onSelect: (coordinates: number[]) => void;
}

const MapSelector: React.FC<MapComponentProps> = ({ onSelect }) => {
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

const MapEventHandler: React.FC = () => {
  const isDragging = useRef(false);

  useMapEvents({
    mousedown(e) {
      isDragging.current = true;
      console.log('🟢 Drag start at:', e.latlng);
    },
    mousemove(e) {
      if (isDragging.current) {
        console.log('🟡 Dragging at:', e.latlng);
        // 👉 Tu peux ici mettre à jour une position, dessiner, etc.
      }
    },
    mouseup(e) {
      if (isDragging.current) {
        isDragging.current = false;
        console.log('🔴 Drag end at:', e.latlng);
        // 👉 Action finale après drag (ex: enregistrer la zone)
      }
    },
  });

  return null; // Ce composant ne rend rien, il est juste là pour écouter les événements
};

const MapComponent: React.FC<MapComponentProps> = ({ onSelect }) => {
    return (
      <MapContainer 
        center={[33.5902, -7.5890]} 
        zoom={13} 
        style={{ height: '400px', width: '100%' }}
        dragging={false}
      >
        <MapSearchComponent onSelect={onSelect}/>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapSelector onSelect={onSelect} />
        <MapEventHandler />
      </MapContainer>
    );
  };
  
  export default MapComponent;