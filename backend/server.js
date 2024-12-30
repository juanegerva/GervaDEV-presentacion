const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const csrf = require('csurf');
const helmet = require('helmet');
const contactRoutes = require('./routes/contactRoutes');
require('dotenv').config({ path: '../.env' });  // ✅ Correcto


const app = express();

// Middleware de seguridad
app.use(helmet());
const allowedOrigins = ['https://gerva-dev.netlify.app', 'http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
}));


app.use(bodyParser.json());
app.use(cookieParser());

// Configuración CSRF
const csrfProtection = csrf({ cookie: true });

// 🔹 Ruta directa para obtener el token CSRF (sin aplicar CSRF a esta ruta)
app.get('/csrf-token', csrfProtection, (req, res) => {
  res.status(200).json({ csrfToken: req.csrfToken() });
});

// 🔹 Aplica CSRF solo a rutas POST después de definir la ruta del token
app.post('/send', csrfProtection, (req, res) => {

  const csrfTokenHeader = req.headers['csrf-token'];

  console.log('🔑 Token CSRF recibido:', csrfTokenHeader);
  console.log('🔒 Token CSRF esperado:', req.csrfToken());

  if (!csrfTokenHeader || csrfTokenHeader !== req.csrfToken()) {
    return res.status(403).json({ error: 'Token CSRF inválido o ausente' });
  }

  const { name, email, message, honeypot } = req.body;

  if (honeypot) {
    return res.status(403).json({ error: 'Acción bloqueada por seguridad.' });
  }

  console.log('✅ Formulario recibido:', { name, email, message });
  res.status(200).json({ message: 'Correo enviado con éxito' });

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

});

// Rutas de contacto (correo)
app.use('/', contactRoutes);

// Middleware global para manejar errores
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({ error: 'Token CSRF inválido o ausente' });
  }
  console.error('❌ Error en el servidor:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar el servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
