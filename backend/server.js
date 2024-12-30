const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

const app = express();
const port = 5000;

// Middleware CSRF
const csrfProtection = csrf({ cookie: true });

// Configuración de CORS
app.use(cors({
  origin: 'http://localhost:5173',  // Asegúrate de usar la URL correcta
  credentials: true,  // Permitir envío de cookies
}));

app.use(bodyParser.json());
app.use(cookieParser());

// Ruta para obtener el token CSRF
app.get('/csrf-token', csrfProtection, (req, res) => {
  const csrfToken = req.csrfToken();
  console.log('🔑 Token CSRF generado:', csrfToken);
  
  // Establece la cookie CSRF correctamente
  res.cookie('_csrf', csrfToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    path: '/',  // Aplica para todas las rutas
  });

  res.json({ csrfToken });
});

// Ruta de envío del formulario
app.post('/send', csrfProtection, (req, res) => {
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  console.log('🔑 Token CSRF recibido:', req.headers['csrf-token']);
  console.log('🔒 Token CSRF esperado (cookie):', req.cookies._csrf);

  res.json({ message: 'Correo enviado con éxito' });
});

app.listen(port, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${port}`);
});
