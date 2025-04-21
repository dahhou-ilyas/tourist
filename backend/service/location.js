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
    
                const ring = coordinates[0];
                if (ring.length < 4 || JSON.stringify(ring[0]) !== JSON.stringify(ring[ring.length - 1])) {
                    ring.push(ring[0]);
                    locationData.location.coordinates = [ring];
                }
                
            }
    
            else {
                return res.status(400).json({ message: "Type géométrique non supporté." });
            }
    
            const newLocation = new LocationGeo(locationData);
            await newLocation.save();
    
            
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
    getNearbyLocations: async (req,res)=>{
        try {
            const { lat, lng } = req.query;
              
            const point = {
                type: 'Point',
                coordinates: [parseFloat(lng), parseFloat(lat)]
            };

            const nearbyPoints = await LocationGeo.find({
                location: {
                  $near: {
                    $geometry: point,
                    $maxDistance: 1000
                  }
                }
            });

            const intersectingPolygons = await LocationGeo.find({
                location: {
                  $geoIntersects: {
                    $geometry: point
                  }
                }
            });

            const allLocations = [
                ...nearbyPoints,
                ...intersectingPolygons.filter(p =>
                  !nearbyPoints.some(np => np._id.toString() === p._id.toString())
                )
            ];

            res.status(200).json(allLocations);

        } catch (error) {
            console.error('Error fetching nearby locations:', error);
            res.status(500).json({ message: 'Internal server error' });
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
    }
}