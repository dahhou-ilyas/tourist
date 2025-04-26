const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors =require("cors")
const { swaggerUi, swaggerSpec } = require('./config/swagger');


dotenv.config();
const app = express();

const allowedOrigins = ["http://localhost:5173"];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));


mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connecté à MongoDBss'))
.catch((err) => console.error(err));

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/auth', require('./routes/auth'));

app.use('/maps', require('./routes/location'));

const PORT = process.env.PORT || 3000;
app.listen(PORT,'0.0.0.0', () => console.log(`Serveur démarré sur le port ${PORT}`));