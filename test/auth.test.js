/**
 * ============================================================================
 * EVIDENCIA: GA7-220501096-AA5-EV01 - Diseño y desarrollo de servicios web - caso
 * APRENDIZ: Iván Andrés Méndez Ardila
 * PROGRAMA: Análisis y Desarrollo de Software (ADSO) - SENA
 * ============================================================================
 * 
 * SCRIPT DE PRUEBAS AUTOMATIZADAS (auth.test.js)
 * Ejecuta pruebas unitarias y de integración sobre los endpoints del servicio web:
 * - Caso 1: Registro exitoso de nuevo usuario (201 Created)
 * - Caso 2: Registro rechazado por usuario duplicado (409 Conflict)
 * - Caso 3: Validación de campos obligatorios vacíos (400 Bad Request)
 * - Caso 4: Inicio de sesión exitoso ("Autenticación satisfactoria" - 200 OK)
 * - Caso 5: Inicio de sesión fallido por contraseña incorrecta ("Error en la autenticación" - 401)
 * - Caso 6: Inicio de sesión fallido por usuario inexistente ("Error en la autenticación" - 401)
 */

const http = require('http');
const app = require('../src/app');

// Puerto temporal exclusivo para ejecutar pruebas
const TEST_PORT = 3099;
let server;

function makeRequest({ method, path, data }) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : '';

    const options = {
      hostname: '127.0.0.1',
      port: TEST_PORT,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('\n================================================================');
  console.log(' INICIANDO BATERÍA DE PRUEBAS DE LA API - EVIDENCIA AA5-EV01');
  console.log(' Aprendiz: Iván Andrés Méndez Ardila - SENA ADSO');
  console.log('================================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(` ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(` ❌ FAIL: ${message}`);
    }
  }

  // Iniciar servidor en puerto de prueba
  await new Promise((res) => {
    server = app.listen(TEST_PORT, '127.0.0.1', () => {
      console.log(`[INFO] Servidor de prueba listo en puerto ${TEST_PORT}\n`);
      res();
    });
  });

  try {
    // -------------------------------------------------------------------------
    // Prueba 1: Estado general de la API
    // -------------------------------------------------------------------------
    const resInfo = await makeRequest({ method: 'GET', path: '/api' });
    assert(resInfo.status === 200 && resInfo.data.aprendiz === 'Iván Andrés Méndez Ardila',
      'GET /api - Retorna información del servicio y aprendiz Iván Andrés Méndez Ardila');

    // -------------------------------------------------------------------------
    // Prueba 2: Registro de nuevo usuario válido
    // -------------------------------------------------------------------------
    const uniqueUser = `aprendiz_${Date.now()}`;
    const resReg = await makeRequest({
      method: 'POST',
      path: '/api/auth/register',
      data: {
        usuario: uniqueUser,
        contrasena: 'claveSegura123',
        nombreCompleto: 'Aprendiz Prueba SENA'
      }
    });
    assert(resReg.status === 201 && resReg.data.exito === true,
      `POST /api/auth/register - Registro exitoso (Status 201) para usuario '${uniqueUser}'`);

    // -------------------------------------------------------------------------
    // Prueba 3: Intento de registro duplicado
    // -------------------------------------------------------------------------
    const resDup = await makeRequest({
      method: 'POST',
      path: '/api/auth/register',
      data: {
        usuario: uniqueUser,
        contrasena: 'otraClave456'
      }
    });
    assert(resDup.status === 409 && resDup.data.exito === false,
      'POST /api/auth/register - Rechaza usuario duplicado con código 409 (Conflict)');

    // -------------------------------------------------------------------------
    // Prueba 4: Validación de campos vacíos
    // -------------------------------------------------------------------------
    const resEmpty = await makeRequest({
      method: 'POST',
      path: '/api/auth/register',
      data: { usuario: '', contrasena: '' }
    });
    assert(resEmpty.status === 400 && resEmpty.data.exito === false,
      'POST /api/auth/register - Rechaza campos vacíos con código 400 (Bad Request)');

    // -------------------------------------------------------------------------
    // Prueba 5: Autenticación exitosa (Credenciales correctas)
    // Según lineamiento: "si la autenticación es correcta saldrá un mensaje de autenticación satisfactoria"
    // -------------------------------------------------------------------------
    const resLoginOk = await makeRequest({
      method: 'POST',
      path: '/api/auth/login',
      data: {
        usuario: uniqueUser,
        contrasena: 'claveSegura123'
      }
    });
    assert(
      resLoginOk.status === 200 &&
      resLoginOk.data.exito === true &&
      resLoginOk.data.mensaje === 'Autenticación satisfactoria',
      'POST /api/auth/login - Autenticación exitosa devuelve: "Autenticación satisfactoria" (Status 200)'
    );

    // -------------------------------------------------------------------------
    // Prueba 6: Autenticación fallida por contraseña incorrecta
    // Según lineamiento: "en caso contrario, debe devolver error en la autenticación."
    // -------------------------------------------------------------------------
    const resLoginBadPass = await makeRequest({
      method: 'POST',
      path: '/api/auth/login',
      data: {
        usuario: uniqueUser,
        contrasena: 'claveErronea999'
      }
    });
    assert(
      resLoginBadPass.status === 401 &&
      resLoginBadPass.data.exito === false &&
      resLoginBadPass.data.mensaje.includes('Error en la autenticación'),
      'POST /api/auth/login - Contraseña errónea devuelve: "Error en la autenticación" (Status 401)'
    );

    // -------------------------------------------------------------------------
    // Prueba 7: Autenticación fallida por usuario inexistente
    // Según lineamiento: "en caso contrario, debe devolver error en la autenticación."
    // -------------------------------------------------------------------------
    const resLoginBadUser = await makeRequest({
      method: 'POST',
      path: '/api/auth/login',
      data: {
        usuario: 'usuario_que_no_existe_123',
        contrasena: 'cualquierClave'
      }
    });
    assert(
      resLoginBadUser.status === 401 &&
      resLoginBadUser.data.exito === false &&
      resLoginBadUser.data.mensaje.includes('Error en la autenticación'),
      'POST /api/auth/login - Usuario inexistente devuelve: "Error en la autenticación" (Status 401)'
    );

    // -------------------------------------------------------------------------
    // Prueba 8: Consulta de usuarios registrados
    // -------------------------------------------------------------------------
    const resUsers = await makeRequest({ method: 'GET', path: '/api/auth/users' });
    assert(resUsers.status === 200 && Array.isArray(resUsers.data.usuarios),
      'GET /api/auth/users - Retorna lista de usuarios registrados correctamente');

  } catch (err) {
    console.error('Error fatal durante la prueba:', err);
  } finally {
    server.close();
    console.log('\n================================================================');
    console.log(` RESULTADO FINAL: ${passed} de ${total} pruebas superadas.`);
    if (passed === total) {
      console.log(' 🏆 TODAS LAS PRUEBAS PASARON EXITOSAMENTE.');
    } else {
      console.log(' ⚠️ ALGUNAS PRUEBAS FALLARON.');
    }
    console.log('================================================================\n');
    process.exit(passed === total ? 0 : 1);
  }
}

runTests();
