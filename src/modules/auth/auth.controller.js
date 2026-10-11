const service = require('./auth.service');

// Envoltura para pasar errores async al errorHandler
const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);

exports.registrar = wrap(async (req, res) => {
  const usuario = await service.registrar(req.body);
  res.status(201).json({ ok: true, usuario });
});

exports.login = wrap(async (req, res) => {
  const data = await service.login(req.body);
  res.json({ ok: true, ...data });
});

exports.perfil = wrap(async (req, res) => {
  const usuario = await service.perfil(req.usuario.id);
  res.json({ ok: true, usuario });
});
