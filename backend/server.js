const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: 'https://gerva-dev.netlify.app',  // Cambiar al dominio del frontend
  credentials: true,
}));

// Configuración de transporte para envío de correos
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Función para enviar correo
async function enviarCorreo({ name, email, message }) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_RECEIVER,
    subject: `Nuevo mensaje de ${name}`,
    text: `Nombre: ${name}\nCorreo: ${email}\nMensaje: ${message}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Correo enviado:', info.response);
  } catch (error) {
    console.error('❌ Error al enviar el correo:', error);
    throw new Error('Error al enviar el correo.');
  }
}

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente 🚀');
});

// Ruta para manejar el formulario
app.post('/send', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    await enviarCorreo({ name, email, message });
    res.status(200).json({ message: 'Formulario enviado correctamente y correo enviado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al enviar el correo' });
  }
});

// Puerto de escucha
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
