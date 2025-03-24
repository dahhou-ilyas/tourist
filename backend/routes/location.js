const express= require('express');

const router = express.Router();

const LocationGeo = require('../model/LocationGeo');

const verifyToken = require("../middleware/verifyToken")

const {VALIDATE,VALIDATION_RULES}= require("../utils/validationRules")


router.post("/locations", verifyToken
    , VALIDATION_RULES.addLocation
    , VALIDATE
    , async(req,res)=>{
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
})

module.exports = router