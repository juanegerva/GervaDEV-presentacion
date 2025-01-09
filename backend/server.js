const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Configuración básica
app.use(bodyParser.json());
app.use(cors({
  origin: 'https://gerva-dev.netlify.app', // Cambia esto al dominio de tu frontend
  credentials: true,
}));

// Ruta para enviar el formulario
app.post('/send', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    console.error('❌ Todos los campos son obligatorios.');
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  // Simulación de recepción de datos en el servidor
  console.log('✅ Formulario recibido:', { name, email, message });

  // Aquí puedes agregar lógica futura para enviar correos
  return res.status(200).json({ message: 'Formulario recibido correctamente' });
});

// Puerto de escucha
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
