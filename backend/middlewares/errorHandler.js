// Middleware para manejo centralizado de errores
const errorHandler = (err, req, res, next) => {
    console.error('🔥 Error detectado:', err.message);
  
    if (err.code === 'EBADCSRFTOKEN') {
      return res.status(403).json({ error: 'Token CSRF inválido o ausente' });
    }
  
    res.status(500).json({ error: 'Error interno del servidor' });
  };
  
  module.exports = errorHandler;
  