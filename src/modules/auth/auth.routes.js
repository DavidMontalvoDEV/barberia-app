const router = require('express').Router();
const { body } = require('express-validator');
const controller = require('./auth.controller');
const validate = require('../../middlewares/validate');
const { verificarToken } = require('../../middlewares/auth');

// POST /api/auth/registro
router.post(
  '/registro',
  [
    body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
    body('email').isEmail().withMessage('Correo inválido').normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('La contraseña debe tener mínimo 8 caracteres'),
    body('telefono').optional().isMobilePhone('any').withMessage('Teléfono inválido'),
  ],
  validate,
  controller.registrar
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Correo inválido').normalizeEmail(),
    body('password').notEmpty().withMessage('La contraseña es obligatoria'),
  ],
  validate,
  controller.login
);

// GET /api/auth/perfil (requiere token)
router.get('/perfil', verificarToken, controller.perfil);

module.exports = router;
