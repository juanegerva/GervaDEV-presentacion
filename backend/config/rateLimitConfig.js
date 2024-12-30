const rateLimit = require('express-rate-limit');

// Limitador de solicitudes para prevenir abuso (10 solicitudes cada 15 min)
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10,  // Máximo de solicitudes permitidas
  message: 'Has superado el límite de envíos. Inténtalo más tarde.',
});

module.exports = rateLimiter;
