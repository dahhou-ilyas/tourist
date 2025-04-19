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
    , VALIDATION_RULES.addLocation
    , VALIDATE
    , locationService.addLocation
)

router.post("/locations/bulk"
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