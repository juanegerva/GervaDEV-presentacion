const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Seguridad con Helmet
app.use(helmet());

// Configuración CORS para permitir cookies
app.use(
  cors({
    origin: 'http://localhost:5173',  // Asegúrate que el origen sea el correcto
    credentials: true,  // Importante para enviar cookies
  })
);

// Middleware para parsear JSON y cookies
app.use(bodyParser.json());
app.use(cookieParser());

// Configuración CSRF - CSRF siempre con cookie
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// Obtener y enviar el token CSRF (ÚNICA GENERACIÓN)
app.get('/csrf-token', (req, res) => {
  const csrfToken = req.csrfToken();
  console.log('🔑 Token CSRF generado:', csrfToken);

  // Enviar la cookie con el token CSRF
  res.cookie('_csrf', csrfToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    path: '/',  // El token es válido para toda la app
  });

  // También enviar el token en JSON (por si se necesita)
  res.json({ csrfToken });
});

// Ruta POST con Validación CSRF
app.post('/send', csrfProtection, (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  console.log('✅ Formulario recibido:', { name, email, message });
  res.status(200).json({ message: 'Correo enviado con éxito' });
});

// Middleware global para errores CSRF
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    console.log('❌ Error CSRF: token csrf no válido.');
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
