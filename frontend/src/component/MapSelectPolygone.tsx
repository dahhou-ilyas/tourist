import React, { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';

interface MapComponentProps {
  onSelect: (coordinates: any) => void;
  locationType: boolean;
  locationNameType:string
}

const MapSelectPolygone: React.FC<MapComponentProps> = ({ onSelect, locationType,locationNameType }) => {
  const map = useMap();
  const [polygon, setPolygon] = useState<L.Polygon | null>(null);
  const [editLayer, setEditLayer] = useState<L.EditToolbar.Edit | null>(null);
  const [drawControl, setDrawControl] = useState<L.Control.Draw | null>(null);
  const [markers, setMarkers] = useState<L.Marker[]>([]);
  
  // Fonction pour mettre à jour les coordonnées du polygone
  const updateCoordinates = (layer: L.Polygon) => {
    const latLngs = layer.getLatLngs()[0] as L.LatLng[];
    const coordinates = latLngs.map(latLng => [latLng.lat, latLng.lng]);
    onSelect(coordinates);
  };

  // Fonction pour ajouter des marqueurs aux milieux des segments
  const addMidPointMarkers = (layer: L.Polygon) => {
    // Supprimer les marqueurs existants
    markers.forEach(marker => marker.remove());
    
    const latLngs = layer.getLatLngs()[0] as L.LatLng[];
    const newMarkers: L.Marker[] = [];
    
    // Pour chaque segment, ajouter un marqueur au milieu
    for (let i = 0; i < latLngs.length; i++) {
      const p1 = latLngs[i];
      const p2 = latLngs[(i + 1) % latLngs.length];
      
      // Calculer le point médian
      const midLat = (p1.lat + p2.lat) / 2;
      const midLng = (p1.lng + p2.lng) / 2;
      
      // Créer une icône personnalisée pour le marqueur de contrôle
      const controlIcon = L.divIcon({
        className: 'control-marker',
        html: '<div style="background-color: white; border: 2px solid blue; border-radius: 50%; width: 12px; height: 12px;"></div>',
        iconSize: [12, 12],
        iconAnchor: [6, 6]
      });
      
      // Créer le marqueur et l'ajouter à la carte
      const marker = L.marker([midLat, midLng], {
        icon: controlIcon,
        draggable: true
      }).addTo(map);
      
      // Manipuler le glisser-déposer pour modifier le polygone
      marker.on('drag', (e) => {
        const markerIndex = i;
        const poly = polygon as L.Polygon;
        const currentLatLngs = poly.getLatLngs()[0] as L.LatLng[];
        
        // Calculer la nouvelle position
        const newPoint = L.latLng((currentLatLngs[i].lat + currentLatLngs[(i + 1) % currentLatLngs.length].lat) / 2, 
                                  (currentLatLngs[i].lng + currentLatLngs[(i + 1) % currentLatLngs.length].lng) / 2);
        
        // Calculer le vecteur de déplacement
        const dx = (e.target.getLatLng().lat - newPoint.lat);
        const dy = (e.target.getLatLng().lng - newPoint.lng);
        
        // Déplacer les deux points adjacents
        const p1 = currentLatLngs[i];
        const p2 = currentLatLngs[(i + 1) % currentLatLngs.length];
        
        p1.lat += dx;
        p1.lng += dy;
        p2.lat += dx;
        p2.lng += dy;
        
        // Mettre à jour le polygone
        poly.setLatLngs(currentLatLngs);
        updateCoordinates(poly);
      });
      
      marker.on('dragend', () => {
        // Mettre à jour les marqueurs après le déplacement
        if (polygon) {
          addMidPointMarkers(polygon);
        }
      });
      
      newMarkers.push(marker);
    }
    
    setMarkers(newMarkers);
  };

  useEffect(() => {
    if (locationNameType !== 'polygon') {
      // Si le type de localisation n'est pas polygon, on nettoie tout
      if (polygon) {
        polygon.remove();
        setPolygon(null);
      }
      
      markers.forEach(marker => marker.remove());
      setMarkers([]);
      
      if (drawControl) {
        map.removeControl(drawControl);
        setDrawControl(null);
      }
      
      return;
    }

    // Configuration des outils de dessin
    const drawOptions = {
      polygon: {
        allowIntersection: false,
        drawError: {
          color: '#e1e100',
          message: '<strong>Le polygone ne peut pas s\'intersecter!</strong>'
        },
        shapeOptions: {
          color: '#3388ff',
          weight: 3
        }
      },
      polyline: false,
      circle: false,
      rectangle: false,
      marker: false,
      circlemarker: false
    };

    console.log(drawOptions);
    // Créer le contrôle de dessin
    const control = new L.Control.Draw({
      draw: drawOptions,
      edit: {
        featureGroup: new L.FeatureGroup(),
        poly: {
          allowIntersection: false
        }
      }
    });
    
    map.addControl(control);
    setDrawControl(control);

    // Gérer l'événement de création d'un polygone
    map.on(L.Draw.Event.CREATED, (e: any) => {
      if (e.layerType === 'polygon') {
        // Supprimer le polygone existant s'il y en a un
        if (polygon) {
          polygon.remove();
        }
        
        // Ajouter le nouveau polygone à la carte
        const newPolygon = e.layer as L.Polygon;
        newPolygon.addTo(map);
        setPolygon(newPolygon);
        
        // Mettre à jour les coordonnées
        updateCoordinates(newPolygon);
        
        // Ajouter les marqueurs de contrôle
        addMidPointMarkers(newPolygon);
      }
    });

    // Gérer l'événement d'édition d'un polygone
    map.on(L.Draw.Event.EDITED, (e: any) => {
      const layers = e.layers;
      layers.eachLayer((layer: L.Polygon) => {
        updateCoordinates(layer);
        addMidPointMarkers(layer);
      });
    });

    // Nettoyage lors du démontage du composant
    return () => {
      if (drawControl) {
        map.removeControl(drawControl);
      }
      
      map.off(L.Draw.Event.CREATED);
      map.off(L.Draw.Event.EDITED);
      
      if (polygon) {
        polygon.remove();
      }
      
      markers.forEach(marker => marker.remove());
    };
  }, [locationNameType]);

  return null;
};

export default MapSelectPolygone;