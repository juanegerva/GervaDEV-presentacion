const cors = require('cors');
const helmet = require('helmet');
const csrf = require('csurf');

// Configuración de Seguridad
function configureSecurity(app) {
  // Seguridad de cabeceras con Helmet
  app.use(helmet());

  // Configuración CORS (Permitir solo frontend específico)
  app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  }));

  // Middleware CSRF (Protección contra ataques CSRF)
  const csrfProtection = csrf({
    cookie: true,
    value: (req) => {
      return req.headers['csrf-token'] || req.body._csrf;
    },
  });
  app.use(csrfProtection);
}

module.exports = { configureSecurity };
