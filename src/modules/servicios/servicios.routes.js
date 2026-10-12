const router = require('express').Router();
const { body, param } = require('express-validator');
const controller = require('./servicios.controller');
const validate = require('../../middlewares/validate');
const { verificarToken, autorizarRoles } = require('../../middlewares/auth');

const id = param('id').isInt({ min: 1 }).withMessage('ID inválido');

// Públicas: cualquiera puede ver el catálogo
router.get('/', controller.listar);
router.get('/:id', [id], validate, controller.obtener);

// Solo administrador
router.post(
  '/',
  verificarToken,
  autorizarRoles('admin'),
  [
    body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
    body('precio').isFloat({ min: 0 }).withMessage('Precio inválido'),
    body('duracion_min').isInt({ min: 5, max: 480 }).withMessage('La duración debe estar entre 5 y 480 minutos'),
  ],
  validate,
  controller.crear
);

router.put(
  '/:id',
  verificarToken,
  autorizarRoles('admin'),
  [
    id,
    body('nombre').optional().trim().notEmpty().withMessage('Nombre inválido'),
    body('precio').optional().isFloat({ min: 0 }).withMessage('Precio inválido'),
    body('duracion_min').optional().isInt({ min: 5, max: 480 }).withMessage('Duración inválida'),
  ],
  validate,
  controller.actualizar
);

router.delete('/:id', verificarToken, autorizarRoles('admin'), [id], validate, controller.desactivar);

module.exports = router;
