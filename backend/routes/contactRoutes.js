const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
require('dotenv').config({ path: '../.env' });

// Middleware para cookies y CSRF
router.use(cookieParser());
const csrfProtection = csrf({ cookie: true });

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Ruta para obtener el token CSRF
router.get('/csrf-token', csrfProtection, (req, res) => {
  res.cookie('_csrf', req.csrfToken(), {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
  });
  res.json({ csrfToken: req.csrfToken() });
});

// Ruta para enviar formulario
router.post('/send', csrfProtection, async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_RECEIVER,
    subject: `Nuevo mensaje de ${name}`,
    text: `Correo: ${email}\nTeléfono: ${phone || 'No proporcionado'}\n\nMensaje:\n${message}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Correo enviado con éxito:', info.response);
    res.status(200).json({ message: 'Correo enviado con éxito' });
  } catch (error) {
    console.error('❌ Error al enviar el correo:', error);
    res.status(500).json({ error: 'Error al enviar el correo' });
  }
});

module.exports = router;
