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
  origin: ['http://localhost:5173', 'https://gerva-dev.netlify.app'],  // Asegúrate de poner el dominio correcto
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
    sameSite: 'Strict',  // Asegura compatibilidad con cross-origin
  }
});

// Middleware CSRF
app.use(csrfProtection);

// Endpoint para obtener el token CSRF
app.get('/csrf-token', (req, res) => {
  const csrfToken = req.csrfToken();
  res.cookie('_csrf', csrfToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
  });
  res.json({ csrfToken });
  console.log('🔑 Token CSRF generado:', csrfToken);
});

// Ruta POST protegida con CSRF
app.post('/send', (req, res) => {
  const csrfHeaderToken = req.headers['csrf-token'];
  const csrfCookieToken = req.cookies['_csrf'];

  console.log('🔑 Token CSRF recibido:', csrfHeaderToken);
  console.log('🔒 Token CSRF esperado:', csrfCookieToken);

  if (csrfHeaderToken !== csrfCookieToken) {
    console.warn('❌ Error CSRF: Token no coincide.');
    return res.status(403).json({ error: 'Token CSRF inválido o ausente' });
  }

  res.status(200).json({ message: 'Correo enviado con éxito' });
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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
