const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Lista de orígenes permitidos
const allowedOrigins = [
  'https://gerva-dev.netlify.app', // URL del frontend en Netlify
  'http://localhost:5173',         // Para desarrollo local
  'https://mi-backend-u1pz.onrender.com'
];

// Configuración de seguridad con Helmet
app.use(helmet());

// Configuración de CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) {
      return callback(null, true);  // Permitir solicitudes sin origen (Postman, Curl, etc.)
    }
    if (allowedOrigins.includes(origin)) {
      callback(null, true);  // Permitir origen válido
    } else {
      console.error(`❌ Origen no autorizado: ${origin}`);
      callback(new Error('No autorizado por CORS'));
    }
  },
  credentials: true,  // Permitir cookies y credenciales
}));

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());

// Configuración CSRF
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// Ruta para devolver el token CSRF
app.get('/csrf-token', (req, res) => {
  const csrfToken = req.csrfToken();
  console.log('🔑 Token CSRF generado:', csrfToken);
  
  // Se envía una cookie accesible por el frontend
  res.cookie('_csrf', csrfToken, {
    httpOnly: true,  // Permitir acceso desde frontend
    secure: true,
    sameSite: 'Strict',
  });

  res.status(200).json({ csrfToken });
});

// Ruta para manejar el formulario
app.post('/send', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  console.log('Formulario recibido:', { name, email, message });
  res.status(200).json({ message: 'Correo enviado con éxito' });
});

// Middleware de manejo de errores CSRF
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    console.error('❌ Error CSRF: token csrf no válido.');
    return res.status(403).json({ error: 'Token CSRF inválido o ausente' });
  }
  next(err);
});

// Puerto de escucha
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
