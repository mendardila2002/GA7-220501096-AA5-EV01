/**
 * ============================================================================
 * EVIDENCIA: GA7-220501096-AA5-EV01 - Diseño y desarrollo de servicios web - caso
 * APRENDIZ: Iván Andrés Méndez Ardila
 * PROGRAMA: Análisis y Desarrollo de Software (ADSO) - SENA
 * ============================================================================
 * 
 * RUTAS DE AUTENTICACIÓN (authRoutes.js)
 * Define los endpoints REST de la API:
 * - POST /api/auth/register : Registro de nuevo usuario
 * - POST /api/auth/login    : Autenticación / Inicio de sesión
 * - GET  /api/auth/users    : Consulta de usuarios registrados
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateAuthInput } = require('../middlewares/validationMiddleware');

/**
 * @route   POST /api/auth/register
 * @desc    Registra un nuevo usuario con usuario y contraseña
 * @access  Público
 */
router.post('/register', validateAuthInput, authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Inicia sesión validando credenciales (usuario y contraseña)
 *          Retorna "Autenticación satisfactoria" o "Error en la autenticación"
 * @access  Público
 */
router.post('/login', validateAuthInput, authController.login);

/**
 * @route   GET /api/auth/users
 * @desc    Obtiene el listado de usuarios registrados (sin contraseñas)
 * @access  Público
 */
router.get('/users', authController.getUsers);

module.exports = router;
