const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendTestMail() {
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
      to: process.env.EMAIL_TO || 'juangervat@gmail.com',  // Usa un correo temporal para probar si no tienes EMAIL_TO
      subject: 'Test de correo nodemailer',
      text: 'Este es un correo de prueba desde el script.',
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📩 Correo enviado con éxito:', info.response);
  } catch (error) {
    console.error('❌ Error al enviar el correo:', error.message);
  }
}

sendTestMail();
