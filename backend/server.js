const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { swaggerUi, swaggerSpec } = require('./config/swagger');


dotenv.config();
const app = express();


mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connecté à MongoDB'))
.catch((err) => console.error(err));

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/auth', require('./routes/auth'));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));