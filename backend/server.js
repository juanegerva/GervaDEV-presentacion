const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Seguridad básica con Helmet
app.use(helmet());

// Habilitar CORS
app.use(
  cors({
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true, // Permitir cookies
  })
);

// Parsear JSON y cookies
app.use(bodyParser.json());
app.use(cookieParser());

// Configurar CSRF correctamente
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// Ruta para devolver el token CSRF
app.get('/csrf-token', (req, res) => {
  const csrfToken = req.csrfToken();
  console.log('🔑 Token CSRF generado:', csrfToken);

  res.cookie('_csrf', csrfToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    path: '/',
  });
  res.json({ csrfToken });
});

// Ruta de prueba para enviar formulario
app.post('/send', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  console.log('✅ Formulario recibido:', { name, email, message });
  res.status(200).json({ message: 'Correo enviado con éxito' });
});

// Middleware para manejar errores de CSRF
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
