// Composant pour afficher les localisations proches
import { useEffect, useState } from 'react';
import { useMap, Circle, Marker, Polygon, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';

// Types pour les données de localisation
interface LocationGeo {
  _id: string;
  city: string;
  neighborhood: string;
  location: {
    type: 'Point' | 'LineString' | 'Polygon';
    coordinates: number[][] | number[] | number[][][];
  };
  riskLevel: 'low' | 'medium' | 'high';
  description: string;
  distanceFromUser?: number;
}

// Props du composant
interface NearbyLocationsProps {
  userPosition?: [number, number]; // Latitude et longitude de l'utilisateur
  maxDistance?: number; // Distance maximale de recherche en mètres
  riskLevel?: 'low' | 'medium' | 'high'; // Filtre optionnel par niveau de risque
  autoLoad?: boolean; // Charger automatiquement les données
}

// Fonction pour obtenir la couleur en fonction du niveau de risque
const getRiskColor = (risk: string): string => {
  switch (risk) {
    case 'high':
      return '#ff4444';
    case 'medium':
      return '#ffaa00';
    case 'low':
      return '#44bb44';
    default:
      return '#3388ff';
  }
};

const NearbyLocations = ({ 
  userPosition, 
  maxDistance = 1000, 
  riskLevel,
  autoLoad = true 
}: NearbyLocationsProps) => {
  const [locations, setLocations] = useState<LocationGeo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const map = useMap();

  // Fonction pour charger les localisations proches
  const loadNearbyLocations = async (lat: number, lng: number) => {
    setLoading(true);
    setError(null);
    
    try {
      // Construire l'URL avec les paramètres
      let url = `/api/locations/nearby?lat=${lat}&lng=${lng}&maxDistance=${maxDistance}`;
      if (riskLevel) {
        url += `&riskLevel=${riskLevel}`;
      }
      
      const response = await axios.get(url);
      
      if (response.data && response.data.locations) {
        setLocations(response.data.locations);
        
        // Si on a des localisations, ajuster la vue de la carte
        if (response.data.locations.length > 0) {
          const bounds = new L.LatLngBounds([]);
          
          // Ajouter la position de l'utilisateur aux limites
          bounds.extend([lat, lng]);
          
          // Ajouter toutes les localisations aux limites
          response.data.locations.forEach((loc: LocationGeo) => {
            if (loc.location.type === 'Point') {
              const [lng, lat] = loc.location.coordinates as number[];
              bounds.extend([lat, lng]);
            } else if (loc.location.type === 'LineString') {
              const coords = loc.location.coordinates as number[][];
              coords.forEach(([lng, lat]) => bounds.extend([lat, lng]));
            } else if (loc.location.type === 'Polygon') {
              const coords = loc.location.coordinates as number[][][];
              coords[0].forEach(([lng, lat]) => bounds.extend([lat, lng]));
            }
          });
          
          // Ajuster la vue avec une marge
          map.fitBounds(bounds, { padding: [50, 50] });
        }
      }
    } catch (err) {
      console.error('Erreur lors du chargement des localisations:', err);
      setError('Impossible de charger les localisations proches');
    } finally {
      setLoading(false);
    }
  };

  // Charger les données lorsque la position change
  useEffect(() => {
    if (userPosition && autoLoad) {
      const [lat, lng] = userPosition;
      loadNearbyLocations(lat, lng);
    }
  }, [userPosition, maxDistance, riskLevel, autoLoad]);

  // Si pas de position utilisateur, ne rien afficher
  if (!userPosition) {
    return null;
  }

  return (
    <>
      {/* Marquer la position de l'utilisateur */}
      <Marker position={[userPosition[0], userPosition[1]]}>
        <Popup>Votre position</Popup>
      </Marker>
      
      {/* Cercle montrant la distance de recherche */}
      <Circle 
        center={[userPosition[0], userPosition[1]]} 
        radius={maxDistance} 
        pathOptions={{ color: '#3388ff', fillColor: '#3388ff', fillOpacity: 0.1 }}
      />
      
      {/* Afficher toutes les localisations */}
      {locations.map((loc) => {
        const color = getRiskColor(loc.riskLevel);
        
        if (loc.location.type === 'Point') {
          const [lng, lat] = loc.location.coordinates as number[];
          return (
            <Marker 
              key={loc._id}
              position={[lat, lng]}
              icon={L.divIcon({
                className: 'custom-marker',
                html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
                iconSize: [16, 16],
                iconAnchor: [8, 8]
              })}
            >
              <Popup>
                <div>
                  <h4>{loc.city} - {loc.neighborhood}</h4>
                  <p>Niveau de risque: <strong style={{ color }}>{loc.riskLevel}</strong></p>
                  {loc.distanceFromUser && (
                    <p>Distance: {loc.distanceFromUser}m</p>
                  )}
                  {loc.description && <p>{loc.description}</p>}
                </div>
              </Popup>
            </Marker>
          );
        } else if (loc.location.type === 'LineString') {
          const positions = (loc.location.coordinates as number[][])
            .map(([lng, lat]) => [lat, lng] as [number, number]);
          
          return (
            <Polyline 
              key={loc._id} 
              positions={positions} 
              pathOptions={{ color }}
            >
              <Popup>
                <div>
                  <h4>{loc.city} - {loc.neighborhood}</h4>
                  <p>Niveau de risque: <strong style={{ color }}>{loc.riskLevel}</strong></p>
                  {loc.description && <p>{loc.description}</p>}
                </div>
              </Popup>
            </Polyline>
          );
        } else if (loc.location.type === 'Polygon') {
          const positions = (loc.location.coordinates as number[][][])[0]
            .map(([lng, lat]) => [lat, lng] as [number, number]);
          
          return (
            <Polygon 
              key={loc._id} 
              positions={positions} 
              pathOptions={{ color, fillColor: color, fillOpacity: 0.2 }}
            >
              <Popup>
                <div>
                  <h4>{loc.city} - {loc.neighborhood}</h4>
                  <p>Niveau de risque: <strong style={{ color }}>{loc.riskLevel}</strong></p>
                  {loc.description && <p>{loc.description}</p>}
                </div>
              </Popup>
            </Polygon>
          );
        }
        
        return null;
      })}
      
      {/* Afficher l'état de chargement ou les erreurs */}
      {loading && (
        <div className="map-overlay">
          <div className="loading-indicator">Chargement des localisations...</div>
        </div>
      )}
      
      {error && (
        <div className="map-overlay error">
          <div className="error-message">{error}</div>
        </div>
      )}
    </>
  );
};

export default NearbyLocations;