// Importar dependencias
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const csrf = require('csurf');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Configuración de sesión
app.use(session({
  secret: process.env.SESSION_SECRET || 'clave-por-defecto',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: true,  // Asegúrate de que sea true en producción (HTTPS)
    sameSite: 'None',  // Permite cookies entre dominios
  },
}));

// Seguridad y configuración básica
app.use(helmet());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
  origin: 'https://gerva-dev.netlify.app',  // Frontend permitido
  credentials: true,
}));

// Middleware CSRF
const csrfProtection = csrf({
  cookie: false,  // Usamos sesión en lugar de cookies para almacenar CSRF
  value: (req) => {
    return req.headers['x-csrf-token'] || req.cookies._csrf || req.session.csrfToken;
  },
});
app.use(csrfProtection);  // Aplicar CSRF a todas las rutas protegidas

// Ruta para obtener el token CSRF
app.get('/csrf-token', (req, res) => {
  try {
    // Si no existe token en la sesión, se genera uno
    if (!req.session.csrfToken) {
      req.session.csrfToken = req.csrfToken();
    }
    console.log('🔑 Token CSRF generado (sesión):', req.session.csrfToken);

    // Establece la cookie CSRF y devuelve el token
    res.cookie('_csrf', req.session.csrfToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
    });
    
    res.status(200).json({ csrfToken: req.session.csrfToken });
  } catch (error) {
    console.error('❌ Error al generar token CSRF:', error.message);
    res.status(500).json({ error: 'Error interno al generar el token CSRF' });
  }
});

// Ruta para enviar el formulario
app.post('/send', (req, res, next) => {
  // Debug: Verifica tokens en sesión, encabezado y cookies
  console.log('🔍 Token en Header (Frontend):', req.headers['x-csrf-token']);
  console.log('🔍 Token en Sesión (Backend):', req.session.csrfToken);
  console.log('🔍 Token en Cookie:', req.cookies._csrf);
  next();
}, csrfProtection, (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  console.log('✅ Formulario recibido:', { name, email, message });
  res.status(200).json({ message: 'Formulario enviado correctamente' });
});

// Middleware para manejar errores CSRF
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    console.error('❌ Error CSRF: Token no válido o ausente.');
    res.status(403).json({ error: 'Token CSRF inválido o ausente' });
  } else {
    next(err);
  }
});

// Puerto de escucha
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
