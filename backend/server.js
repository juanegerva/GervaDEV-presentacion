const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
require('dotenv').config();
const contactRoutes = require('./routes/contactRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Seguridad y configuración básica
app.use(helmet());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: 'https://gerva-dev.netlify.app',  // Asegúrate de cambiar esto si es necesario
    credentials: true,
  })
);

// Rutas
app.use('/contact', contactRoutes);

// Middleware de errores centralizado
app.use(errorHandler);

// Puerto de escucha
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
