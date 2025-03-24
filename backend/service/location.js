const LocationGeo = require('../model/LocationGeo');


module.exports = {
    addLocation : async(req,res)=>{
        try {
            const locationData = req.body;
    
            const newLocation = new LocationGeo(locationData);
    
            await newLocation.save();
    
            res.status(201).json({
                message: 'Location ajoutée avec succès',
                location: newLocation
            });
    
    
        } catch (error) {
            console.error('Erreur lors de l’ajout de la localisation :', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    },
    getNearbyLocations: async (req,res)=>{
        try {
            const { lat, lng } = req.query;
            
            if (!lat || !lng) {
                return res.status(400).json({ message: 'Latitude and longitude are required' });
            }
            
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