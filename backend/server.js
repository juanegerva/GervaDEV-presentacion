const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
require('dotenv').config();

// Inicializar la aplicación de Express
const app = express();

// Configuración de seguridad básica
app.use(helmet());
app.use(bodyParser.json());
app.use(cookieParser());

// Configuración de CORS (Permite solicitudes desde Netlify)
app.use(cors({
  origin: 'https://gerva-dev.netlify.app',  // Reemplaza con el dominio de tu frontend
  credentials: true,  // Permite enviar cookies de sesión
}));

// Middleware para asegurarse de que todas las solicitudes OPTIONS sean aceptadas
app.options('*', cors());

// Añadir encabezados CORS manualmente (por si acaso)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://gerva-dev.netlify.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// Ruta simple para probar que el servidor funciona
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente 🚀');
});

// Ruta para enviar el formulario (sin CSRF)
app.post('/send', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  console.log('✅ Formulario recibido:', { name, email, message });
  res.status(200).json({ message: 'Formulario enviado correctamente' });
});

// Puerto de escucha
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
