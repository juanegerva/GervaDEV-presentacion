const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
require('dotenv').config();

router.post('/send', async (req, res) => {
  const { name, email, message, phone } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  console.log('📩 Enviando correo a:', process.env.EMAIL_TO);  // Para ver si se reconoce el destinatario
  console.log('📧 Mensaje recibido:', { name, email, message });
  
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO || "juangervat@gmail.com",
      subject: 'Nuevo Mensaje desde el Formulario',
      text: `
        Nombre: ${name}
        Email: ${email}
        Teléfono: ${phone || 'No proporcionado'}
        Mensaje: ${message}
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📩 Correo enviado con éxito:', info.response);

    res.status(200).json({ message: 'Correo enviado correctamente' });
  } catch (error) {
    console.error('❌ Error al enviar el correo:', error.message);
    res.status(500).json({ error: 'Error al enviar el correo' });
  }
});

module.exports = router;

