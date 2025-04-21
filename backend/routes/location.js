const express= require('express');

const router = express.Router();

const verifyToken = require("../middleware/verifyToken")

const {VALIDATE,VALIDATION_RULES}= require("../utils/validationRules")

const locationService = require("../service/location")


/**
 * @swagger
 * tags:
 *   name: Locations
 *   description: Management of geographic locations
 */

/**
 * @swagger
 * /locations:
 *   post:
 *     summary: Add a new location
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - city
 *               - neighborhood
 *               - location
 *             properties:
 *               city:
 *                 type: string
 *                 example: Casablanca
 *               neighborhood:
 *                 type: string
 *                 example: Hay Mohammadi
 *               location:
 *                 type: object
 *                 required:
 *                   - type
 *                   - coordinates
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: [Point, LineString, Polygon]
 *                     example: Point
 *                   coordinates:
 *                     type: array
 *                     items:
 *                       type: number
 *                     example: [-7.5890, 33.5902]
 *               riskLevel:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 example: medium
 *               description:
 *                 type: string
 *                 example: Residential area with heavy traffic
 *     responses:
 *       201:
 *         description: Location successfully added
 *       400:
 *         description: Invalid or incomplete request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.post("/locations"
    , verifyToken
    , VALIDATION_RULES.addLocation
    , VALIDATE
    , locationService.addLocation
)

/**
 * @swagger
 * /locations/bulk:
 *   post:
 *     summary: Ajouter plusieurs points géographiques
 *     description: |
 *       Ajoute **plusieurs** emplacements de type **Point** en une seule requête.  
 *       Chaque paire `[longitude, latitude]` contenue dans `location.coordinates`
 *       sera enregistrée comme un point distinct dans la base.
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []          # Nécessite un JWT Bearer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - city
 *               - neighborhood
 *               - location
 *             properties:
 *               city:
 *                 type: string
 *                 example: Casablanca
 *               neighborhood:
 *                 type: string
 *                 example: Hay Mohammadi
 *               location:
 *                 type: object
 *                 required:
 *                   - type
 *                   - coordinates
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: [Point]          # Uniquement Point pour ce endpoint
 *                     example: Point
 *                   coordinates:
 *                     type: array
 *                     description: Liste de couples **[longitude, latitude]**
 *                     items:
 *                       type: array
 *                       minItems: 2
 *                       maxItems: 2
 *                       items:
 *                         type: number
 *                     example:
 *                       - [-7.5890, 33.5902]
 *                       - [-7.5905, 33.5920]
 *               riskLevel:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 default: medium
 *                 example: medium
 *               description:
 *                 type: string
 *                 default: ""
 *                 example: Zone résidentielle à fort trafic
 *     responses:
 *       201:
 *         description: Points ajoutés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 2 points adeed succesefly
 *       400:
 *         description: Requête invalide — type différent de *Point* ou coordonnées mal formées
 *       401:
 *         description: Non autorisé — jeton manquant ou invalide
 *       500:
 *         description: Erreur interne du serveur
 */
router.post("/locations/bulk"
    , verifyToken
    , VALIDATION_RULES.addLocation
    , VALIDATE
    , locationService.addMultiplePoints
)

/**
 * @swagger
 * /locations/nearby:
 *   get:
 *     summary: Get locations near a given point
 *     tags: [Locations]
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *         description: Latitude of the user
 *       - in: query
 *         name: lng
 *         required: true
 *         schema:
 *           type: number
 *         description: Longitude of the user
 *     responses:
 *       200:
 *         description: List of nearby locations
 *       400:
 *         description: Missing or invalid query parameters
 *       500:
 *         description: Internal server error
 */

router.get("/locations/nearby"
    , verifyToken
    , VALIDATION_RULES.getNearbyLocations
    , VALIDATE
    , locationService.getNearbyLocations);

module.exports = router