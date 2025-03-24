const express= require("express");
const router = express.Router();
const authService = require('../service/auth')

const {VALIDATE,VALIDATION_RULES}= require("../utils/validationRules")


router.post('/register'
  , VALIDATION_RULES.register
  , VALIDATE
  , authService.register
)

router.post('/login'
  , VALIDATION_RULES.login
  , VALIDATE
  , authService.login
)

module.exports = router;
