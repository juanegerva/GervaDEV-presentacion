const express = require('express');
const nodemailer = require('nodemailer');
const csrf = require('csurf');
const router = express.Router();
require('dotenv').config();

// Configuración de protección CSRF
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
  },
  value: (req) => {
    const tokenFromHeader = req.headers['x-csrf-token'];
    const tokenFromCookie = req.cookies._csrf;

    // Validar que el token del encabezado coincida con el de la cookie
    if (tokenFromHeader === tokenFromCookie) {
      return tokenFromHeader;
    }
    return '';  // CSRF inválido si no coinciden
  },
});



// Ruta para enviar correos desde el formulario
router.post('/send', csrfProtection, async (req, res) => {
  const { name, email, message, phone } = req.body;
  console.log('🧩 Token en Cookie (Backend):', req.cookies._csrf);
  console.log('🧩 Token en Header (Frontend):', req.headers['x-csrf-token']);
  // Validación de campos obligatorios
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    // Configuración del transporte de correo (SMTP)
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true para SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Configuración de las opciones del correo
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO || "juanegerva@gmail.com",
      subject: 'Nuevo Mensaje desde el Formulario',
      text: `
        Nombre: ${name}
        Email: ${email}
        Teléfono: ${phone || 'No proporcionado'}
        Mensaje: ${message}
      `,
    };

    // Enviar correo
    const info = await transporter.sendMail(mailOptions);
    console.log('📩 Correo enviado con éxito:', info.response);
    res.status(200).json({ message: 'Correo enviado correctamente' });
  } catch (error) {
    console.error('❌ Error al enviar el correo:', error.message);
    res.status(500).json({ error: 'Error al enviar el correo' });
  }
});

// Ruta para obtener el token CSRF
let csrfTokenCache = '';  // Almacenamiento temporal del token

app.get('/csrf-token', (req, res) => {
  // Si el token ya existe en la sesión/caché, reutilizarlo
  if (!csrfTokenCache) {
    csrfTokenCache = req.csrfToken();  // Generar solo una vez
  }

  console.log('🔑 Token CSRF generado:', csrfTokenCache);

  // Establecer el token en la cookie y responder con el mismo token
  res.cookie('_csrf', csrfTokenCache, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
  });

  res.status(200).json({ csrfToken: csrfTokenCache });
});


module.exports = router;
