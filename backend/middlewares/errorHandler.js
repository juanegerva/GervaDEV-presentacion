// Middleware para manejo centralizado de errores
// Middleware para manejo centralizado de errores
const errorHandler = (err, req, res, next) => {
  console.error('🔥 Error detectado:', err.message);
  res.status(500).json({ error: 'Error interno del servidor' });
};

module.exports = errorHandler;
