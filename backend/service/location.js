const { default: mongoose } = require('mongoose');
const LocationGeo = require('../model/LocationGeo');


module.exports = {
    addLocation: async (req, res) => {
        try {
            const locationData = req.body;
            const location = locationData.location;
            
            if (!location || !location.type || !location.coordinates) {
                return res.status(400).json({ message: "Champs 'location' incomplet ou invalide." });
            }
    
            const { type, coordinates } = location;

            if (type === "Point"){
                if (
                    !Array.isArray(coordinates) ||
                    coordinates.length !== 2 ||
                    typeof coordinates[0] !== "number" ||
                    typeof coordinates[1] !== "number"
                ) {
                    return res.status(400).json({ message: "Coordonnées invalides pour un Point." });
                }
            } else if (type === "LineString") {
                if (!Array.isArray(coordinates)) {
                    return res.status(400).json({ message: "Coordonnées invalides pour un LineString." });
                }
                if (Array.isArray(coordinates[0][0])) {
                    locationData.location.coordinates = coordinates.flat();
                }
            }
    
            else if (type === "Polygon") {
                if (!Array.isArray(coordinates) || !Array.isArray(coordinates[0])) {
                  return res.status(400).json({ message: "Coordonnées invalides pour un Polygon." });
                }
                
                // S'assurer que chaque point est un tableau à 2 dimensions [longitude, latitude]
                const ring = coordinates.map(point => {
                  if (Array.isArray(point) && point.length === 2) {
                    return point;
                  } else if (Array.isArray(point) && point.length > 2) {
                    return [point[0], point[1]]; // Prendre seulement les 2 premières valeurs
                  }
                  return null;
                }).filter(point => point !== null);
                
                // Vérifier si le premier et le dernier point sont identiques
                if (ring.length < 4 || JSON.stringify(ring[0]) !== JSON.stringify(ring[ring.length - 1])) {
                  ring.push([...ring[0]]); // Ajouter une copie du premier point à la fin
                }
                
                locationData.location.coordinates = [ring];
              }
    
            else {
                return res.status(400).json({ message: "Type géométrique non supporté." });
            }
    
            const newLocation = new LocationGeo(locationData);
            const data=await newLocation.save();
            console.log("xxxxxxxxxxxxxxx");
            console.log(data.location.coordinates);
            console.log("xxxxxxxxxxxxxxx");
            
            const responseData = {
                _id: newLocation._id,
                city: newLocation.city,
                neighborhood: newLocation.neighborhood,
                riskLevel: newLocation.riskLevel
            };


            
            res.status(201).json({
                message: 'Location ajoutée avec succès',
                location: responseData
            });
        } catch (error) {
            console.error('Erreur lors de ajout de la localisation :', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    },
    addMultiplePoints : async (req, res) =>{
        try {
            const { city, neighborhood, description = "", riskLevel = "medium", location } = req.body;
            if (location.type !== "Point") {
                return res.status(400).json({ message: "Ce endpoint ne gère que des Points." });
            }
            if (!Array.isArray(location.coordinates) || location.coordinates.length === 0) {
                return res.status(400).json({ message: "Liste de coordonnées invalide ou vide." });
            }
          
            const invalidPoint = location.coordinates.find(coord => 
                !Array.isArray(coord) || coord.length !== 2 || 
                typeof coord[0] !== 'number' || typeof coord[1] !== 'number'
            );

            if (invalidPoint) {
                return res.status(400).json({ message: "Une ou plusieurs coordonnées sont invalides." });
            }

            const locationsToSave = location.coordinates.map(coord => ({
                city,
                neighborhood,
                description,
                riskLevel,
                location: {
                  type: "Point",
                  coordinates: coord
                }
            }));

            const savedLocations = await LocationGeo.insertMany(locationsToSave);

            res.status(201).json({
                message: `${savedLocations.length} points adeed succesefly`,
            });
        } catch (error) {
            console.error("Erreur lors de l’ajout des points :", error);
            res.status(500).json({ message: "Erreur serveur" });
        }
    },
    getNearbyLocations: async (req, res) => {
        try {
          // Récupérer les paramètres de la requête avec des valeurs par défaut
          const { 
            lat, 
            lng, 
            maxDistance = 1000, // Distance en mètres, par défaut 1km
            riskLevel = null    // Optionnel pour filtrer par niveau de risque
          } = req.query;

      
          // Valider les coordonnées
          const latitude = parseFloat(lat);
          const longitude = parseFloat(lng);
          
          if (isNaN(latitude) || isNaN(longitude)) {
            return res.status(400).json({ message: 'Coordonnées invalides' });
          }
      
          // Créer un point GeoJSON représentant la position de l'utilisateur
          const userPoint = {
            type: 'Point',
            coordinates: [latitude, longitude]
          };
          console.log(userPoint);
      
          // Préparer les critères de recherche
          const searchCriteria = {};
          
          // Ajouter un filtre par niveau de risque si spécifié
          if (riskLevel) {
            searchCriteria.riskLevel = riskLevel;
          }
      
          // 1. Trouver les Points proches
          searchCriteria.location = {
            $near: {
              $geometry: userPoint,
              $maxDistance: parseInt(maxDistance)
            }
          };
          const nearbyPoints = await LocationGeo.find({
            ...searchCriteria,
            'location.type': 'Point'
          });
      
          // 2. Trouver les LineString proches
          const nearbyLines = await LocationGeo.find({
            ...searchCriteria,
            'location.type': 'LineString'
          });
      
          // 3. Trouver les Polygones qui contiennent le point ou qui sont proches
          delete searchCriteria.location;
          
          // Trouver les polygones qui contiennent le point de l'utilisateur
          const intersectingPolygons = await LocationGeo.find({
            ...searchCriteria,
            'location.type': 'Polygon',
            location: {
              $geoIntersects: {
                $geometry: userPoint
              }
            }
          });
      
          // Trouver les polygones proches mais qui ne contiennent pas le point
          const nearbyPolygons = await LocationGeo.find({
            ...searchCriteria,
            'location.type': 'Polygon',
            location: {
              $near: {
                $geometry: userPoint,
                $maxDistance: parseInt(maxDistance)
              }
            }
          });
      
          // Fusionner tous les résultats en évitant les doublons
          const allLocationsSet = new Set();
          
          // Fonction pour ajouter des locations à l'ensemble sans duplication
          const addLocationsToSet = (locations) => {
            locations.forEach(loc => {
              allLocationsSet.add(loc._id.toString());
            });
          };
      
          // Ajouter toutes les localizations à notre ensemble
          addLocationsToSet(nearbyPoints);
          addLocationsToSet(nearbyLines);
          addLocationsToSet(intersectingPolygons);
          addLocationsToSet(nearbyPolygons);
      
          // Récupérer toutes les locations par leurs IDs
          const allLocations = await LocationGeo.find({
            _id: { $in: Array.from(allLocationsSet).map(id => new mongoose.Types.ObjectId(id)) }
          });
      
          // Pour chaque location, calculer sa distance par rapport à l'utilisateur si c'est un Point
          const locationsWithDistance = allLocations.map(location => {
            const locationObj = location.toObject();
            
            if (location.location.type === 'Point') {
              // Calculer la distance approximative en mètres (utiliser une bibliothèque de géolocalisation 
              // comme Turf.js serait plus précis pour une utilisation en production)
              const [lon2, lat2] = location.location.coordinates;
              
              // Calcul de distance simplifié (formule haversine)
              const R = 6371e3; // Rayon de la Terre en mètres
              const φ1 = latitude * Math.PI/180;
              const φ2 = lat2 * Math.PI/180;
              const Δφ = (lat2-latitude) * Math.PI/180;
              const Δλ = (lon2-longitude) * Math.PI/180;
      
              const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                        Math.cos(φ1) * Math.cos(φ2) *
                        Math.sin(Δλ/2) * Math.sin(Δλ/2);
              const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
              const distance = R * c;
              
              locationObj.distanceFromUser = Math.round(distance);
            }
            return locationObj;
          });
      
          // Trier les résultats par niveau de risque et distance (si disponible)
          const sortedLocations = locationsWithDistance.sort((a, b) => {
            // D'abord par niveau de risque (high > medium > low)
            const riskOrder = { high: 0, medium: 1, low: 2 };
            if (riskOrder[a.riskLevel] !== riskOrder[b.riskLevel]) {
              return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
            }
            
            // Ensuite par distance si disponible
            if (a.distanceFromUser && b.distanceFromUser) {
              return a.distanceFromUser - b.distanceFromUser;
            }
            return 0;
          });
      
          res.status(200).json({
            message: 'Emplacements proches trouvés avec succès',
            count: sortedLocations.length,
            locations: sortedLocations
          });
        } catch (error) {
          console.error('Erreur lors de la recherche des localisations proches:', error);
          res.status(500).json({ message: 'Erreur serveur' });
        }
    }
}