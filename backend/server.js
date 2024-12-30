const express = require('express');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// CORS con cookies habilitadas
app.use(cors({
  origin: 'http://localhost:5173',  // Asegúrate de poner el dominio del frontend
  methods: ['GET', 'POST'],
  credentials: true,  // Permitir envío de cookies
}));

app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());

// CSRF Protection con opciones de cookies
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 1000,  // Asegura compatibilidad con cross-origin
  }
});

// Middleware CSRF
app.use(csrfProtection);

// Endpoint para obtener el token CSRF (SOLO UNA VEZ)
app.get('/csrf-token', (req, res) => {
  const csrfToken = req.csrfToken();
  res.json({ csrfToken });
  console.log('🔑 Token CSRF generado:', csrfToken);
});

// Ruta POST con protección CSRF
app.post('/send', (req, res) => {
  console.log('🔑 Token CSRF recibido:', req.headers['csrf-token']);
  console.log('🔒 Token CSRF esperado:', req.cookies['_csrf']);
});

// Manejo de errores global
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    console.error('❌ Error CSRF:', err.message);
    return res.status(403).json({ error: 'Token CSRF inválido o ausente' });
  }
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
