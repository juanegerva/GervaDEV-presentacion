const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// --- Configuración de seguridad ---
app.use(helmet());
app.use(cors({
  origin: "https://gerva-dev.netlify.app/" || "http://localhost:5173/#contact",  // Asegúrate que coincida con el front
  credentials: true
}));
app.use(bodyParser.json());
app.use(cookieParser());

// --- RUTA CSRF (Mantener) ---
app.get('/csrf-token', (req, res) => {
  const csrfToken = 'dummy-token';  // Token falso
  res.cookie('_csrf', csrfToken, { httpOnly: true, secure: true, sameSite: 'Strict' });
  res.json({ csrfToken });
});

// --- RUTA POST /send SIN CSRF ---
app.post('/send', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  console.log('Formulario recibido:', { name, email, message });
  res.status(200).json({ message: 'Correo enviado con éxito' });
});

// --- MANEJO DE ERRORES ---
app.use((err, req, res, next) => {
  console.error('❌ Error CSRF:', err.message);
  res.status(403).json({ error: 'Token CSRF inválido o ausente' });
});

// --- INICIAR SERVIDOR ---
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
