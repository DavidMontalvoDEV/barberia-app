const service = require('./citas.service');
const { wrap } = require('../../utils/helpers');

exports.barberos = wrap(async (req, res) => {
  res.json({ ok: true, barberos: await service.barberos() });
});

exports.listar = wrap(async (req, res) => {
  res.json({ ok: true, citas: await service.listar(req.usuario) });
});

exports.crear = wrap(async (req, res) => {
  res.status(201).json({ ok: true, cita: await service.crear(req.usuario.id, req.body) });
});

exports.cancelar = wrap(async (req, res) => {
  res.json({ ok: true, cita: await service.cancelar(Number(req.params.id), req.usuario) });
});

exports.cambiarEstado = wrap(async (req, res) => {
  res.json({
    ok: true,
    cita: await service.cambiarEstado(Number(req.params.id), req.usuario, req.body.estado),
  });
});
