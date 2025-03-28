import React, { useState } from 'react';
import { useMap } from 'react-leaflet';

const MapSearchComponent: React.FC<{ onSelect: (coords: number[]) => void }> = ({ onSelect }: { onSelect: (coords: number[]) => void }) => {

    const map = useMap();
    const [searchQuery, setSearchQuery] = useState('');
    const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault(); // ⬅️ Ajout important ici
        e.stopPropagation();
      
        if (!searchQuery.trim()) return;
      
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
          );
          const results = await response.json();
      
          if (results && results.length > 0) {
            const { lat, lon } = results[0];
            const coords = [parseFloat(lat), parseFloat(lon)];
      
            map.flyTo(coords, 15);
            setMarkerPosition(coords);
            onSelect([parseFloat(lon), parseFloat(lat)]);
          } else {
            alert('Aucun résultat trouvé.');
          }
        } catch (err) {
          console.error('Erreur de recherche :', err);
        }
      };
      


    return (
        <div className="absolute top-0 right-0 z-[1000]">
          <form>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={(e) => e.stopPropagation()} // évite que le clic sur l'input remonte
              placeholder="Rechercher une adresse..."
              className="px-4 py-2 border rounded w-72 shadow"
            />
            <button
              type="button" // important ! sinon => submit par défaut
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSearch(e);
              }}
              className="p-2 border-2 border-black z-[1000]"
            >
              search
            </button>
          </form>
        </div>

    );
};

export default MapSearchComponent;