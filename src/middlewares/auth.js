const jwt = require('jsonwebtoken');

// Verifica el token JWT del header: Authorization: Bearer <token>
function verificarToken(req, res, next) {
  const header = req.headers.authorization || '';
  const [tipo, token] = header.split(' ');

  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ ok: false, mensaje: 'Token requerido' });
  }
  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET); // { id, rol }
    next();
  } catch (e) {
    return res.status(401).json({ ok: false, mensaje: 'Token inválido o expirado' });
  }
}

// Restringe el acceso por rol: autorizarRoles('admin', 'barbero')
const autorizarRoles = (...roles) => (req, res, next) => {
  if (!req.usuario || !roles.includes(req.usuario.rol)) {
    return res.status(403).json({ ok: false, mensaje: 'No tienes permisos para esta acción' });
  }
  next();
};

module.exports = { verificarToken, autorizarRoles };
