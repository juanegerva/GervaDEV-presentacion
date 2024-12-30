const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const contactRoutes = require('./routes/contactRoutes');
require('dotenv').config();

const app = express();

// Seguridad con Helmet
app.use(
  helmet({
    contentSecurityPolicy: false, // Desactivar CSP para evitar bloqueos durante desarrollo
  })
);

// Configuración CORS para permitir el frontend
const allowedOrigins = ['http://localhost:5173', 'https://mi-frontend.netlify.app'];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Middleware para parsear JSON y cookies
app.use(bodyParser.json());
app.use(cookieParser());

// Configuración CSRF
const csrfProtection = csrf({ cookie: { httpOnly: true, secure: true, sameSite: 'Strict' } });
app.use(csrfProtection);

// Token CSRF
app.get('/csrf-token', (req, res) => {
  const token = req.csrfToken();
  console.log('🔑 Token CSRF generado:', token);
  res.cookie('_csrf', req.csrfToken(), {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',  // Evita ataques CSRF desde otros dominios
    path: '/',
  });
  res.json({ csrfToken: req.csrfToken() });
});

// Rutas de contacto
app.use('/send', contactRoutes);

// Manejador de errores CSRF
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    console.error('❌ Error CSRF: token csrf no válido');
    res.status(403).json({ error: 'Token CSRF inválido o ausente' });
  } else {
    next(err);
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
