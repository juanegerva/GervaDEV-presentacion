const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const contactRoutes = require('./routes/contactRoutes');
require('dotenv').config();

// Inicializar la aplicación de Express
const app = express();

// Configuración básica de seguridad y middleware
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use('/', contactRoutes);

// Puerto de escucha
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
