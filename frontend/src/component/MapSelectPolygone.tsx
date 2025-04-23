import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Marker, Polygon, Polyline, useMapEvents } from "react-leaflet";



const MapSelectPolygone = forwardRef<MapSelectPolygoneRef, MapComponentProps>(
  ({ onSelect, locationNameType }, ref) => {

    const [isCreating, setIsCreating] = useState(false);
    const [currentPolygon, setCurrentPolygon] = useState<Polygon>([]);
    const [editablePolygon, setEditablePolygon] = useState<Polygon | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [activeVertexIndex, setActiveVertexIndex] = useState<number | null>(null);
    const [draggingVertex, setDraggingVertex] = useState(false);

    const [allPolygon,setAllPolygon] = useState<Polygon[]|null>(null);


    useImperativeHandle(ref, () =>(
      {
        resetPolygon: () => {
          resetPolygon();
        },
        getCurrentPolygon: () => {
          return editablePolygon;
        },
        setPolygon: (polygon: Polygon) => {
          setEditablePolygon(polygon);
          setIsEditing(true);
          setIsCreating(false);
          setCurrentPolygon([]);
          onSelect(polygon);
        }
      }
    ))

    useEffect(()=>{
        resetPolygon();
          
    },[locationNameType])
  
    useEffect(() => {
      if (locationNameType !== "Polygon") {
        setCurrentPolygon([]);
        setEditablePolygon(null);
      }
    }, [locationNameType]);
  
    useEffect(() => {
      if (editablePolygon && editablePolygon.length >= 3) {
        onSelect(editablePolygon);
      }
    }, [editablePolygon]);
  
    const handleMarkerDrag = (index: number, position: Point) => {
      if (editablePolygon) {
        const updatedPolygon = [...editablePolygon];
        updatedPolygon[index] = position;
        setEditablePolygon(updatedPolygon);
      }
    };
  
    useMapEvents({
      mousedown(e) {
        if(currentPolygon.length >= 4) return;
        if (locationNameType !== "Polygon") return;
        
        
        const { lat, lng } = e.latlng;
        
        // Si on est en mode édition et qu'on clique sur un vertex
        if (isEditing && activeVertexIndex !== null) {
          setDraggingVertex(true);
          return;
        }
        
        // Si on commence à créer un nouveau polygone
        if (!isCreating && !editablePolygon) {
          setIsCreating(true);
          setCurrentPolygon([[lat, lng],[lat, lng],]);
          return;
        }
        
        // Si on ajoute un point au polygone en cours de création
        if (isCreating && !editablePolygon) {
          setCurrentPolygon(prev => [...prev, [lat, lng]]);
          
          // Si on a au moins 4 points, vérifier si on ferme le polygone
          if (currentPolygon.length >= 3) {
            const firstPoint = currentPolygon[0];
            const distance = Math.sqrt(
              Math.pow(lat - firstPoint[0], 2) + Math.pow(lng - firstPoint[1], 2)
            );
            
            // Si on est proche du premier point, fermer le polygone
            if (distance < 0.001) { // Ajustez cette valeur selon la précision souhaitée
              setEditablePolygon([...currentPolygon]);
              setIsCreating(false);
              setCurrentPolygon([]);
              setIsEditing(true);
            }
          }
        }
      },
      mousemove(e) {
        if (locationNameType !== "Polygon") return;
        
        const { lat, lng } = e.latlng;
        
        // Si on est en train de déplacer un vertex
        if (isEditing && draggingVertex && activeVertexIndex !== null && editablePolygon) {
          const updatedPolygon = [...editablePolygon];
          updatedPolygon[activeVertexIndex] = [lat, lng];
          setEditablePolygon(updatedPolygon);
          return;
        }
        
        // Mettre à jour le point courant lors de la création
        if (isCreating && currentPolygon.length > 0) {
            
          const updatedPolygon = [...currentPolygon];
          if (updatedPolygon.length > 1) {
            
            // Mettre à jour le dernier point pour suivre la souris
            updatedPolygon[updatedPolygon.length - 1] = [lat, lng];
            console.log(updatedPolygon);
            setCurrentPolygon(updatedPolygon);
          }
        }
      },
      mouseup() {
        if(currentPolygon.length >= 4) return;
        if (locationNameType !== "Polygon") return;
        
        // Arrêter le déplacement d'un vertex
        if (draggingVertex) {
          setDraggingVertex(false);
        }
      },
      dblclick() {
        if (locationNameType !== "Polygon" || !isCreating) return;
        if (currentPolygon.length >= 3) {
          setEditablePolygon([...currentPolygon]);
          if(allPolygon){
            const newP = [...allPolygon,currentPolygon];
            setAllPolygon(newP)
          }else{
            setAllPolygon([currentPolygon]);
          }
          
          setIsCreating(false);
          setCurrentPolygon([]);
          setIsEditing(true);
        }
      },
    });
  
    const resetPolygon = () => {
      setEditablePolygon(null);
      setIsEditing(false);
      setIsCreating(false);
      setCurrentPolygon([]);
      setActiveVertexIndex(null);
    };
  
    const handleResetClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      resetPolygon();
    };
  
    return (
      <>
        {/* Afficher le polygone en cours de création */}
        {isCreating && currentPolygon.length >= 2 && (
          <Polyline positions={currentPolygon} color="blue" />
        )}
        
        {/* Afficher le polygone éditable */}
        {editablePolygon && editablePolygon.length >= 3 && (
          <>
            <Polygon positions={editablePolygon} />
            
            {/* Afficher les marqueurs pour les sommets */}
            {isEditing && editablePolygon.map((position, index) => (
              <Marker
                key={`vertex-${index}`}
                position={position}
                draggable={true}
                eventHandlers={{
                  mousedown: () => setActiveVertexIndex(index),
                  mouseup: () => setActiveVertexIndex(null),
                  drag: (e) => handleMarkerDrag(index, [e.latlng.lat, e.latlng.lng]),
                }}
              />
            ))}
            
            {/* Bouton pour réinitialiser le polygone */}
            {isEditing && (
              <div className="leaflet-control leaflet-bar" style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000 }}>
                <a href="#" onClick={handleResetClick} title="Créer un nouveau polygone">
                  Nouveau polygone
                </a>
              </div>
            )}
          </>
        )}
      </>
    );
  }
)
export default MapSelectPolygone