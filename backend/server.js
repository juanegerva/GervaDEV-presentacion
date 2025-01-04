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
  'https://gerva-dev.netlify.app',
  'http://localhost:5173',
  'https://mi-backend-u1pz.onrender.com',
];

// Permitir subdominios de Netlify dinámicamente
const dynamicNetlifyOrigin = /^https:\/\/[a-zA-Z0-9-]+--gerva-dev\.netlify\.app$/;

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || dynamicNetlifyOrigin.test(origin)) {
      callback(null, true);
    } else {
      console.error(`❌ Origen no autorizado: ${origin}`);
      callback(new Error('No autorizado por CORS'));
    }
  },
  credentials: true,
}));


// Aplica antes de definir rutas


// Middleware
app.use(bodyParser.json());
app.use(cookieParser());


// Configuración CSRF
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
  },
  value: (req) => {
    return req.headers['x-csrf-token'] || req.body._csrf || req.query._csrf || '';
  },
});


app.use(csrfProtection);




// Ruta para devolver el token CSRF
app.get('/csrf-token', (req, res) => {
  const csrfToken = req.csrfToken ? req.csrfToken() : null;
  if (!csrfToken) {
    return res.status(500).json({ error: 'No se pudo generar el token CSRF' });
  }
  console.log('🔑 Token CSRF generado:', csrfToken);
  res.cookie('_csrf', csrfToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
  });
  res.status(200).json({ csrfToken });
});


// Ruta para manejar el formulario


app.post('/send', (req, res) => {
  const { name, email, message } = req.body;
  console.log('Formulario recibido:', { name, email, message });
  res.status(200).json({ message: 'Correo enviado con éxito' });
});



// Middleware de manejo de errores CSRF
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    console.error('❌ Error CSRF: token no válido o ausente.');
    return res.status(403).json({ error: 'Token CSRF inválido o ausente' });
  }
  next(err);
});


app.use((req, res, next) => {
  console.log("🔍 Token CSRF recibido en el servidor:", req.headers['csrf-token']);
  next();
});


// Puerto de escucha (usar el puerto de Render)
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor corriendo en http://0.0.0.0:${PORT}`);
});
