/**
 * ============================================================================
 * EVIDENCIA: GA7-220501096-AA5-EV01 - Diseño y desarrollo de servicios web - caso
 * APRENDIZ: Iván Andrés Méndez Ardila
 * PROGRAMA: Análisis y Desarrollo de Software (ADSO) - SENA
 * ============================================================================
 * 
 * CONTROLADOR DE AUTENTICACIÓN (authController.js)
 * Contiene la lógica de negocio para:
 * 1. Registro de nuevos usuarios en el sistema.
 * 2. Inicio de sesión (autenticación) con validación de credenciales.
 * 3. Listado de usuarios registrados (modo informativo).
 */

const userModel = require('../models/userModel');

/**
 * Controlador para el Registro de Usuarios.
 * Recibe 'usuario' y 'contrasena' validados por el middleware.
 * Si el usuario ya existe, responde con código HTTP 409 (Conflict).
 * Si no existe, lo encripta, lo guarda y responde con código HTTP 201 (Created).
 * 
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} res - Objeto de respuesta de Express
 */
async function register(req, res) {
  try {
    const { usuario, contrasena, nombreCompleto } = req.authData;

    // Verificar si el usuario ya se encuentra registrado
    const existingUser = userModel.findByUsername(usuario);
    if (existingUser) {
      return res.status(409).json({
        exito: false,
        codigo: 409,
        mensaje: `El usuario '${usuario}' ya se encuentra registrado en el sistema.`,
        fecha: new Date().toISOString()
      });
    }

    // Crear el nuevo usuario con contraseña cifrada
    const nuevoUsuario = await userModel.createUser({
      usuario,
      contrasena,
      nombreCompleto
    });

    // Respuesta exitosa de creación
    return res.status(201).json({
      exito: true,
      codigo: 201,
      mensaje: 'Registro satisfactorio: El usuario ha sido registrado exitosamente.',
      usuario: {
        id: nuevoUsuario.id,
        usuario: nuevoUsuario.usuario,
        nombreCompleto: nuevoUsuario.nombreCompleto,
        rol: nuevoUsuario.rol,
        creadoEn: nuevoUsuario.creadoEn
      },
      fecha: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error durante el proceso de registro:', error);
    return res.status(500).json({
      exito: false,
      codigo: 500,
      mensaje: 'Error interno en el servidor al intentar registrar el usuario.',
      error: error.message
    });
  }
}

/**
 * Controlador para el Inicio de Sesión (Login / Autenticación).
 * Recibe 'usuario' y 'contrasena'.
 * 
 * Cumplimiento del lineamiento de la evidencia SENA:
 * - "si la autenticación es correcta saldrá un mensaje de autenticación satisfactoria"
 * - "en caso contrario, debe devolver error en la autenticación."
 * 
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} res - Objeto de respuesta de Express
 */
async function login(req, res) {
  try {
    const { usuario, contrasena } = req.authData;

    // 1. Buscar el usuario en la base de datos / almacenamiento
    const user = userModel.findByUsername(usuario);

    // Caso: El usuario no existe en la base de datos
    if (!user) {
      return res.status(401).json({
        exito: false,
        codigo: 401,
        // Mensaje requerido según los términos de la evidencia
        mensaje: 'Error en la autenticación: Credenciales inválidas. El usuario no existe o la contraseña es incorrecta.',
        fecha: new Date().toISOString()
      });
    }

    // 2. Validar que la contraseña ingresada coincida con el hash almacenado
    const isPasswordValid = await userModel.verifyPassword(contrasena, user.contrasena);

    // Caso: La contraseña es incorrecta
    if (!isPasswordValid) {
      return res.status(401).json({
        exito: false,
        codigo: 401,
        // Mensaje requerido según los términos de la evidencia
        mensaje: 'Error en la autenticación: Credenciales inválidas. Contraseña incorrecta.',
        fecha: new Date().toISOString()
      });
    }

    // Caso de Éxito: Credenciales válidas
    // Retorna el mensaje exacto exigido: "Autenticación satisfactoria"
    return res.status(200).json({
      exito: true,
      codigo: 200,
      mensaje: 'Autenticación satisfactoria',
      datos: {
        id: user.id,
        usuario: user.usuario,
        nombreCompleto: user.nombreCompleto,
        rol: user.rol,
        ultimoAcceso: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error durante el proceso de autenticación:', error);
    return res.status(500).json({
      exito: false,
      codigo: 500,
      mensaje: 'Error interno en el servidor durante la autenticación.',
      error: error.message
    });
  }
}

/**
 * Controlador auxiliar para obtener la lista de usuarios registrados.
 * Permite al evaluador consultar qué usuarios existen actualmente.
 * No expone hashes de contraseñas.
 */
function getUsers(req, res) {
  try {
    const users = userModel.getAllUsers();
    const safeUsers = users.map(u => ({
      id: u.id,
      usuario: u.usuario,
      nombreCompleto: u.nombreCompleto,
      rol: u.rol,
      creadoEn: u.creadoEn
    }));

    return res.status(200).json({
      exito: true,
      total: safeUsers.length,
      usuarios: safeUsers
    });
  } catch (error) {
    return res.status(500).json({
      exito: false,
      mensaje: 'Error al consultar la lista de usuarios.'
    });
  }
}

module.exports = {
  register,
  login,
  getUsers
};
