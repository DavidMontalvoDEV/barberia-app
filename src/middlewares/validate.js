const { validationResult } = require('express-validator');

// Devuelve 400 con la lista de errores de validación
module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ ok: false, errores: errors.array() });
  }
  next();
};
