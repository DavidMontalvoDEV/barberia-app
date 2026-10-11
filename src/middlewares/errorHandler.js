// Manejo centralizado de errores
module.exports = (err, req, res, next) => {
  const status = err.status || 500;
  if (status === 500) console.error(err);
  res.status(status).json({
    ok: false,
    mensaje: status === 500 ? 'Error interno del servidor' : err.message,
  });
};
