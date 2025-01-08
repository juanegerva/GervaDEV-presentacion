const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const csrf = require('csurf');
const helmet = require('helmet');
require('dotenv').config();

// Importar connect-redis y crear cliente Redis
const RedisStore = require('connect-redis')(session);
const { createClient } = require('redis');

// Crear cliente Redis
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.connect()
  .then(() => console.log('✅ Conectado a Redis'))
  .catch((err) => console.error('❌ Error de conexión a Redis:', err));

// Inicializar la aplicación de Express
const app = express();

// Configuración de sesión con RedisStore
app.use(session({
  store: new RedisStore({
    client: redisClient,
    prefix: 'sess:',
  }),
  secret: process.env.SESSION_SECRET || 'mi-secreto',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'None',
  }
}));

// Seguridad y configuración básica
app.use(helmet());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
  origin: 'https://gerva-dev.netlify.app',  // Cambia esto al dominio de tu frontend
  credentials: true,
}));

// Middleware CSRF
const csrfProtection = csrf({
  value: (req) => {
    return req.cookies._csrf;
  },
});

app.use(csrfProtection);

// Ruta para obtener el token CSRF
app.get('/csrf-token', (req, res) => {
  try {
    if (!req.session.csrfToken) {
      req.session.csrfToken = req.csrfToken();
      console.log('🔑 Token CSRF generado (Backend):', req.session.csrfToken);
    } else {
      console.log('🔁 Reutilizando token CSRF existente:', req.session.csrfToken);
    }

    if (req.session.csrfToken) {
      res.cookie('_csrf', req.session.csrfToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'None',
      });
      res.status(200).json({ csrfToken: req.session.csrfToken });
    } else {
      throw new Error('Token CSRF inválido');
    }
  } catch (error) {
    console.error('❌ Error al generar token CSRF:', error.message);
    res.status(500).json({ error: 'Error interno al generar el token CSRF' });
  }
});

// Ruta para enviar el formulario
app.post('/send', (req, res, next) => {
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
