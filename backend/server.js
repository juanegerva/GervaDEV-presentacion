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
  secret: process.env.SESSION_SECRET || 'avefenix',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
  },
}));

// Configuración de seguridad
app.use(helmet());
app.use(bodyParser.json());
app.use(cookieParser());

// Configuración de CORS
app.use(cors({
  origin: 'https://gerva-dev.netlify.app',  // Cambia según tu frontend
  credentials: true,
}));

// Middleware CSRF
const csrfProtection = csrf({
  cookie: false,
  value: (req) => {
    return req.headers['x-csrf-token'] || req.session.csrfToken;
  },
});
app.use(csrfProtection);  // IMPORTANTE: Aplicar CSRF a nivel global

// Ruta para obtener el token CSRF
app.get('/csrf-token', (req, res) => {
  try {
    // Si el token no existe en la sesión, generar uno nuevo
    if (!req.session.csrfToken) {
      req.session.csrfToken = req.csrfToken();
    }
    console.log('🔑 Token CSRF generado (sesión):', req.session.csrfToken);

    // Almacenar el token en la cookie y devolverlo como JSON
    res.cookie('_csrf', req.session.csrfToken, {
      httpOnly: true,
      secure: true,  // Importante para HTTPS
      sameSite: 'None',
    });
    
    res.status(200).json({ csrfToken: req.session.csrfToken });
  } catch (error) {
    console.error('❌ Error interno al generar el token CSRF:', error.message);
    res.status(500).json({ error: 'Error interno al generar el token CSRF' });
  }
});


// Ruta protegida para enviar formulario
app.post('/send', csrfProtection, (req, res) => {
  res.status(200).json({ message: 'Formulario enviado correctamente' });
});

// Puerto de escucha
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
