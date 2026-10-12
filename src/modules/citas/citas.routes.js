const router = require('express').Router();
const { body, param } = require('express-validator');
const controller = require('./citas.controller');
const validate = require('../../middlewares/validate');
const { verificarToken, autorizarRoles } = require('../../middlewares/auth');

// Todas las rutas de citas exigen estar autenticado
router.use(verificarToken);

const id = param('id').isInt({ min: 1 }).withMessage('ID inválido');

// GET /api/citas/barberos -> lista de barberos para elegir
router.get('/barberos', controller.barberos);

// GET /api/citas -> mis citas (según mi rol)
router.get('/', controller.listar);

// POST /api/citas -> agendar (solo clientes)
router.post(
  '/',
  autorizarRoles('cliente'),
  [
    body('barbero_id').isInt({ min: 1 }).withMessage('barbero_id inválido'),
    body('servicio_id').isInt({ min: 1 }).withMessage('servicio_id inválido'),
    body('fecha_hora')
      .matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/)
      .withMessage('Formato requerido: AAAA-MM-DD HH:mm (ej: 2026-10-20 10:00)'),
    body('notas').optional().trim().isLength({ max: 255 }).withMessage('Máximo 255 caracteres'),
  ],
  validate,
  controller.crear
);

// PATCH /api/citas/:id/cancelar
router.patch('/:id/cancelar', [id], validate, controller.cancelar);

// PATCH /api/citas/:id/estado -> confirmar o completar (barbero o admin)
router.patch(
  '/:id/estado',
  autorizarRoles('barbero', 'admin'),
  [id, body('estado').isIn(['confirmada', 'completada']).withMessage('Estado permitido: confirmada o completada')],
  validate,
  controller.cambiarEstado
);

module.exports = router;
