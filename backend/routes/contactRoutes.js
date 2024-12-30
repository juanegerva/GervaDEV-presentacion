const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
require('dotenv').config();

// Ruta de envío de formulario
router.post('/send', async (req, res) => {
  const { name, email, message, phone } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  console.log('✅ Formulario recibido:', { name, email, phone, message });

  try {
    // Configuración de nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Contenido del email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: 'Nuevo Mensaje desde el Formulario',
      text: `
        Nombre: ${name}
        Email: ${email}
        Teléfono: ${phone || 'No proporcionado'}
        Mensaje: ${message}
      `,
    };

    // Enviar correo
    await transporter.sendMail(mailOptions);
    console.log('📩 Correo enviado con éxito');

    res.status(200).json({ message: 'Correo enviado correctamente' });
  } catch (error) {
    console.error('❌ Error al enviar el correo:', error);
    res.status(500).json({ error: 'Error al enviar el correo' });
  }
});

module.exports = router;
