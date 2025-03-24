const express= require('express');

const router = express.Router();

const verifyToken = require("../middleware/verifyToken")

const {VALIDATE,VALIDATION_RULES}= require("../utils/validationRules")

const locationService = require("../service/location")

router.post("/locations", verifyToken
    , VALIDATION_RULES.addLocation
    , VALIDATE
    , locationService.addLocation
)

module.exports = router