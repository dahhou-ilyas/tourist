const express= require("express");
const router = express.Router();

const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken');

const { body, validationResult } = require('express-validator');

const User = require("../model/User");


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
    ]
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

router.post('/register',VALIDATION_RULES.register, VALIDATE,
  async (req,res)=>{
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: 'Cet utilisateur existe déjà' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ username, email, password: hashedPassword });

        await user.save();

        const payload = {
            user: {
              id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
              if (err) throw err;
              res.json({ token });
            }
        );
    }catch(err){
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
  }
)

router.post('/login',VALIDATION_RULES.login, VALIDATE,
  async (req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }


    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(400).json({ error: 'Identifiants invalides' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ error: 'Identifiants invalides' });
        }


        const payload = {
            user: {
              id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
              if (err) throw err;
              res.json({ token });
            }
        );

    } catch (error) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
  }
)

module.exports = router;
