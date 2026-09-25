/**
 * ============================================================================
 * EVIDENCIA: GA7-220501096-AA5-EV01 - Diseño y desarrollo de servicios web - caso
 * APRENDIZ: Iván Andrés Méndez Ardila
 * PROGRAMA: Análisis y Desarrollo de Software (ADSO) - SENA
 * ============================================================================
 * 
 * LÓGICA DEL CLIENTE WEB DE PRUEBAS (public/app.js)
 * Conecta los formularios interactivos con los endpoints de Express,
 * actualiza la consola HTTP en tiempo real y refresca la tabla de usuarios.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elementos de Login
  const loginForm = document.getElementById('loginForm');
  const loginUser = document.getElementById('loginUser');
  const loginPassword = document.getElementById('loginPassword');
  const btnLogin = document.getElementById('btnLogin');
  const btnFillDefault = document.getElementById('btnFillDefault');
  const loginFeedback = document.getElementById('loginFeedback');
  const feedbackIcon = document.getElementById('feedbackIcon');
  const feedbackTitle = document.getElementById('feedbackTitle');
  const feedbackMessage = document.getElementById('feedbackMessage');

  // Elementos de Registro
  const registerForm = document.getElementById('registerForm');
  const regFullName = document.getElementById('regFullName');
  const regUser = document.getElementById('regUser');
  const regPassword = document.getElementById('regPassword');
  const btnRegister = document.getElementById('btnRegister');
  const registerFeedback = document.getElementById('registerFeedback');
  const regFeedbackIcon = document.getElementById('regFeedbackIcon');
  const regFeedbackTitle = document.getElementById('regFeedbackTitle');
  const regFeedbackMessage = document.getElementById('regFeedbackMessage');

  // Elementos de Consola HTTP
  const consoleMethod = document.getElementById('consoleMethod');
  const consoleUrl = document.getElementById('consoleUrl');
  const consoleStatus = document.getElementById('consoleStatus');
  const consoleJson = document.getElementById('consoleJson');
  const btnClearConsole = document.getElementById('btnClearConsole');

  // Elementos de Usuarios
  const usersTableBody = document.getElementById('usersTableBody');
  const btnRefreshUsers = document.getElementById('btnRefreshUsers');

  // Cargar puerto dinámicamente si aplica
  const serverPortEl = document.getElementById('serverPort');
  if (serverPortEl && window.location.port) {
    serverPortEl.textContent = window.location.port;
  }

  /**
   * Actualiza la consola de respuestas HTTP en la interfaz
   */
  function updateConsole(method, url, status, data) {
    consoleMethod.textContent = method;
    consoleMethod.className = `badge-method ${method === 'POST' ? 'method-post' : 'method-get'}`;
    consoleUrl.textContent = url;
    consoleStatus.textContent = `Status: ${status}`;
    consoleStatus.className = `badge-status status-${status}`;
    consoleJson.textContent = JSON.stringify(data, null, 2);
  }

  /**
   * Muestra banner de retroalimentación
   */
  function showFeedback(banner, iconEl, titleEl, msgEl, isSuccess, title, message) {
    banner.classList.remove('hidden', 'success', 'error');
    banner.classList.add(isSuccess ? 'success' : 'error');
    iconEl.textContent = isSuccess ? '✅' : '❌';
    titleEl.textContent = title;
    msgEl.textContent = message;
  }

  /**
   * 1. Manejo del Formulario de Inicio de Sesión
   * Evidencia: "si la autenticación es correcta saldrá un mensaje de autenticación satisfactoria,
   * en caso contrario, debe devolver error en la autenticación."
   */
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
      usuario: loginUser.value.trim(),
      contrasena: loginPassword.value
    };

    btnLogin.disabled = true;
    btnLogin.innerHTML = '<span>Verificando...</span>';

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      updateConsole('POST', '/api/auth/login', response.status, data);

      if (response.ok && data.exito) {
        showFeedback(
          loginFeedback,
          feedbackIcon,
          feedbackTitle,
          feedbackMessage,
          true,
          data.mensaje, // "Autenticación satisfactoria"
          `Bienvenido(a), ${data.datos?.nombreCompleto || payload.usuario}. Sesión validada con éxito.`
        );
      } else {
        showFeedback(
          loginFeedback,
          feedbackIcon,
          feedbackTitle,
          feedbackMessage,
          false,
          'Error en la autenticación',
          data.mensaje || 'Credenciales inválidas.'
        );
      }
    } catch (err) {
      console.error('Error al conectar con la API:', err);
      updateConsole('POST', '/api/auth/login', 500, { error: err.message });
      showFeedback(
        loginFeedback,
        feedbackIcon,
        feedbackTitle,
        feedbackMessage,
        false,
        'Error de Conexión',
        'No fue posible comunicarse con el servicio web Express.'
      );
    } finally {
      btnLogin.disabled = false;
      btnLogin.innerHTML = '<span>Iniciar Sesión</span>';
    }
  });

  /**
   * 2. Botón para cargar usuario demo de prueba
   */
  btnFillDefault.addEventListener('click', () => {
    loginUser.value = 'ivan.mendez';
    loginPassword.value = 'sena2026';
    loginUser.focus();
  });

  /**
   * 3. Manejo del Formulario de Registro
   */
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
      usuario: regUser.value.trim(),
      contrasena: regPassword.value,
      nombreCompleto: regFullName.value.trim()
    };

    btnRegister.disabled = true;
    btnRegister.innerHTML = '<span>Registrando...</span>';

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      updateConsole('POST', '/api/auth/register', response.status, data);

      if (response.status === 201 && data.exito) {
        showFeedback(
          registerFeedback,
          regFeedbackIcon,
          regFeedbackTitle,
          regFeedbackMessage,
          true,
          'Registro Exitoso',
          `Usuario '${payload.usuario}' creado con éxito. Ahora puedes iniciar sesión.`
        );
        // Pre-cargar en el formulario de login para comodidad del evaluador
        loginUser.value = payload.usuario;
        loginPassword.value = payload.contrasena;
        registerForm.reset();
        // Refrescar lista de usuarios
        loadUsers();
      } else {
        showFeedback(
          registerFeedback,
          regFeedbackIcon,
          regFeedbackTitle,
          regFeedbackMessage,
          false,
          'Error en el Registro',
          data.mensaje || 'No se pudo completar el registro.'
        );
      }
    } catch (err) {
      console.error('Error al conectar con la API:', err);
      updateConsole('POST', '/api/auth/register', 500, { error: err.message });
      showFeedback(
        registerFeedback,
        regFeedbackIcon,
        regFeedbackTitle,
        regFeedbackMessage,
        false,
        'Error de Conexión',
        'No fue posible comunicarse con el servicio web.'
      );
    } finally {
      btnRegister.disabled = false;
      btnRegister.innerHTML = '<span>Registrar Usuario en la API</span>';
    }
  });

  /**
   * 4. Consultar y renderizar usuarios registrados
   */
  async function loadUsers() {
    usersTableBody.innerHTML = '<tr><td colspan="5" class="loading-cell">Consultando servicio web...</td></tr>';
    try {
      const res = await fetch('/api/auth/users');
      const data = await res.json();

      if (res.ok && Array.isArray(data.usuarios)) {
        if (data.usuarios.length === 0) {
          usersTableBody.innerHTML = '<tr><td colspan="5" class="loading-cell">No hay usuarios registrados aún.</td></tr>';
          return;
        }

        usersTableBody.innerHTML = data.usuarios.map(u => `
          <tr>
            <td><strong>#${u.id}</strong></td>
            <td><code>${escapeHtml(u.usuario)}</code></td>
            <td>${escapeHtml(u.nombreCompleto || '-')}</td>
            <td><span class="badge-sena" style="font-size: 0.7rem;">${escapeHtml(u.rol || 'Usuario')}</span></td>
            <td>${new Date(u.creadoEn).toLocaleString()}</td>
          </tr>
        `).join('');
      } else {
        usersTableBody.innerHTML = '<tr><td colspan="5" class="loading-cell">No se pudieron cargar los usuarios.</td></tr>';
      }
    } catch (err) {
      usersTableBody.innerHTML = '<tr><td colspan="5" class="loading-cell">Error al conectar con el endpoint de usuarios.</td></tr>';
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[m]));
  }

  // Eventos de botones adicionales
  btnRefreshUsers.addEventListener('click', loadUsers);

  btnClearConsole.addEventListener('click', () => {
    consoleMethod.textContent = 'REST';
    consoleMethod.className = 'badge-method';
    consoleUrl.textContent = '/api/auth/...';
    consoleStatus.textContent = 'Status: En espera';
    consoleStatus.className = 'badge-status status-init';
    consoleJson.textContent = '// Consola lista para recibir nuevas peticiones HTTP';
  });

  // Carga inicial de usuarios al abrir la página
  loadUsers();
});
