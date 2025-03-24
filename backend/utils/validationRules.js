const { body, validationResult } = require('express-validator');


const VALIDATION_RULES = {
    register: [
      body('username')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Le nom d\'utilisateur doit contenir au moins 3 caractères'),
      body('email')
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage('Adresse e-mail invalide'),
      body('password')
        .isLength({ min: 6 })
        .withMessage('Le mot de passe doit contenir au moins 6 caractères')
    ],
    login : [
        body('email').isEmail().withMessage('Adresse e-mail invalide'),
        body('password').exists().withMessage('Le mot de passe est requis')
    ],
    addLocation : [
        body('city').notEmpty().withMessage('City is required'),
        body('neighborhood').notEmpty().withMessage('Neighborhood is required'),
        body('location.type')
          .isIn(['Point', 'LineString', 'Polygon'])
          .withMessage('Invalid location type'),
        body('location.coordinates')
          .isArray({ min: 2 })
          .withMessage('Coordinates must be an array'),
        body('riskLevel')
          .optional()
          .isIn(['low', 'medium', 'high'])
          .withMessage('Invalid risk level'),
        body('description').optional().isString()
    ],
};

const VALIDATE = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    
    return res.status(400).json({ 
      success: false,
      errors: errors.array() 
    });
};

module.exports = {VALIDATE,VALIDATION_RULES}