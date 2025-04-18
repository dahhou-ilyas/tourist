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
    
            // 🔍 Traitement selon le type géométrique
            if (type === "LineString") {
                if (!Array.isArray(coordinates)) {
                    return res.status(400).json({ message: "Coordonnées invalides pour un LineString." });
                }
                // Correction si coordonnées mal imbriquées
                if (Array.isArray(coordinates[0][0])) {
                    locationData.location.coordinates = coordinates.flat();
                }
            }
    
            else if (type === "Polygon") {
                if (!Array.isArray(coordinates) || !Array.isArray(coordinates[0])) {
                    return res.status(400).json({ message: "Coordonnées invalides pour un Polygon." });
                }
    
                // Correction : si l'anneau extérieur n'est pas fermé, on le referme automatiquement
                const ring = coordinates[0];
                if (ring.length < 4 || JSON.stringify(ring[0]) !== JSON.stringify(ring[ring.length - 1])) {
                    ring.push(ring[0]); // referme le polygone
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
            console.error('Erreur lors de l’ajout de la localisation :', error);
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
    } 
}