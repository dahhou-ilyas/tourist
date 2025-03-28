import React, { useState } from 'react';
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
      }
    });
  
    return position ? <Marker position={position} /> : null;
};

const MapComponent: React.FC<MapComponentProps> = ({ onSelect }) => {
    return (
      <MapContainer 
        center={[33.5902, -7.5890]} 
        zoom={13} 
        style={{ height: '400px', width: '100%' }}
      >
        <MapSearchComponent onSelect={onSelect}/>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapSelector onSelect={onSelect} />
      </MapContainer>
    );
  };
  
  export default MapComponent;