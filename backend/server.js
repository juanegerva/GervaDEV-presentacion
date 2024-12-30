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
app.use(cors({
  origin: 'http://localhost:5173',  // React frontend
  credentials: true,  // Permitir cookies
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
app.post('*', csrfProtection);

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
