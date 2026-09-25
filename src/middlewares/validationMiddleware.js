/**
 * ============================================================================
 * EVIDENCIA: GA7-220501096-AA5-EV01 - Diseño y desarrollo de servicios web - caso
 * APRENDIZ: Iván Andrés Méndez Ardila
 * PROGRAMA: Análisis y Desarrollo de Software (ADSO) - SENA
 * ============================================================================
 * 
 * MIDDLEWARE DE VALIDACIÓN DE ENTRADAS (validationMiddleware.js)
 * Este middleware intercepta las solicitudes hacia las rutas de registro y login,
 * validando que los parámetros requeridos ('usuario' y 'contrasena') estén
 * presentes en el cuerpo (body) de la solicitud y no contengan valores vacíos.
 */

/**
 * Valida los datos requeridos para la autenticación y el registro.
 * Permite tanto los nombres en español ('usuario', 'contrasena') como en inglés
 * ('username', 'password') para mayor compatibilidad y flexibilidad con clientes HTTP.
 */
function validateAuthInput(req, res, next) {
  const body = req.body || {};

  // Normalizar campos recibidos
  const usuario = body.usuario !== undefined ? body.usuario : body.username;
  const contrasena = body.contrasena !== undefined ? body.contrasena : body.password;

  // Validación de existencia y tipo
  if (typeof usuario !== 'string' || usuario.trim() === '') {
    return res.status(400).json({
      exito: false,
      codigo: 400,
      mensaje: 'Error de validación: El campo "usuario" es obligatorio y no puede estar vacío.'
    });
  }

  if (typeof contrasena !== 'string' || contrasena.trim() === '') {
    return res.status(400).json({
      exito: false,
      codigo: 400,
      mensaje: 'Error de validación: El campo "contrasena" es obligatorio y no puede estar vacío.'
    });
  }

  // Si la longitud de la contraseña es muy corta (regla de negocio adicional recomendada)
  if (contrasena.length < 4) {
    return res.status(400).json({
      exito: false,
      codigo: 400,
      mensaje: 'Error de validación: La contraseña debe tener al menos 4 caracteres.'
    });
  }

  // Asignar los campos limpios y normalizados al request para su uso posterior
  req.authData = {
    usuario: usuario.trim(),
    contrasena: contrasena,
    nombreCompleto: body.nombreCompleto || body.fullName || usuario.trim()
  };

  // Continuar con el siguiente controlador
  next();
}

module.exports = {
  validateAuthInput
};
