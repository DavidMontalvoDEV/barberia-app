const service = require('./servicios.service');
const { wrap } = require('../../utils/helpers');

exports.listar = wrap(async (req, res) => {
  res.json({ ok: true, servicios: await service.listar() });
});

exports.obtener = wrap(async (req, res) => {
  res.json({ ok: true, servicio: await service.obtener(req.params.id) });
});

exports.crear = wrap(async (req, res) => {
  res.status(201).json({ ok: true, servicio: await service.crear(req.body) });
});

exports.actualizar = wrap(async (req, res) => {
  res.json({ ok: true, servicio: await service.actualizar(req.params.id, req.body) });
});

exports.desactivar = wrap(async (req, res) => {
  await service.desactivar(req.params.id);
  res.json({ ok: true, mensaje: 'Servicio desactivado' });
});
