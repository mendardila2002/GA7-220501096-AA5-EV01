/**
 * ============================================================================
 * EVIDENCIA: GA7-220501096-AA5-EV01 - Diseño y desarrollo de servicios web - caso
 * APRENDIZ: Iván Andrés Méndez Ardila
 * PROGRAMA: Análisis y Desarrollo de Software (ADSO) - SENA
 * ============================================================================
 * 
 * SERVIDOR PRINCIPAL (server.js)
 * Punto de entrada para el arranque del servicio web en el puerto configurado.
 */

const app = require('./app');

// Definición del puerto de escucha (3000 por defecto o variable de entorno)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('================================================================');
  console.log(' SERVICIO WEB INICIADO CON ÉXITO');
  console.log(' Evidencia: GA7-220501096-AA5-EV01');
  console.log(' Aprendiz:  Iván Andrés Méndez Ardila');
  console.log(' SENA - Análisis y Desarrollo de Software');
  console.log('----------------------------------------------------------------');
  console.log(` Servidor escuchando en: http://localhost:${PORT}`);
  console.log(` Interfaz web interactiva: http://localhost:${PORT}`);
  console.log(` Endpoint Info API:       http://localhost:${PORT}/api`);
  console.log(` Endpoint Registro:       POST http://localhost:${PORT}/api/auth/register`);
  console.log(` Endpoint Login:          POST http://localhost:${PORT}/api/auth/login`);
  console.log(` Endpoint Usuarios:       GET  http://localhost:${PORT}/api/auth/users`);
  console.log('================================================================');
});
