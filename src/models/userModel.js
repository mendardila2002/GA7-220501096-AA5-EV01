/**
 * ============================================================================
 * EVIDENCIA: GA7-220501096-AA5-EV01 - Diseño y desarrollo de servicios web - caso
 * APRENDIZ: Iván Andrés Méndez Ardila
 * PROGRAMA: Análisis y Desarrollo de Software (ADSO) - SENA
 * ============================================================================
 * 
 * MODELO DE DATOS DE USUARIOS (userModel.js)
 * Este módulo gestiona el almacenamiento, consulta y persistencia de usuarios.
 * Para facilitar la ejecución y pruebas sin necesidad de configurar una base de
 * datos externa (como MySQL o MongoDB), se implementa persistencia en archivo JSON local
 * con contraseñas cifradas mediante la librería bcryptjs.
 */

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Ruta del archivo JSON donde se almacenan los datos de usuarios
const DATA_FILE = path.join(__dirname, '../../data/users.json');

/**
 * Función auxiliar para asegurar que el directorio y archivo de datos existan.
 */
function ensureDataFileExists() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    // Usuario por defecto para pruebas iniciales del instructor
    const salt = bcrypt.genSaltSync(10);
    const defaultPasswordHash = bcrypt.hashSync('sena2026', salt);

    const initialData = [
      {
        id: 1,
        usuario: 'ivan.mendez',
        nombreCompleto: 'Iván Andrés Méndez Ardila',
        rol: 'Aprendiz SENA',
        contrasena: defaultPasswordHash,
        creadoEn: new Date().toISOString()
      }
    ];

    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  }
}

// Inicializar el almacenamiento si no existe
ensureDataFileExists();

/**
 * Lee todos los usuarios almacenados en el archivo JSON.
 * @returns {Array} Lista de usuarios
 */
function getAllUsers() {
  try {
    ensureDataFileExists();
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al leer el archivo de usuarios:', error.message);
    return [];
  }
}

/**
 * Guarda la lista de usuarios en el archivo JSON.
 * @param {Array} users - Lista actualizada de usuarios
 */
function saveUsers(users) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error al guardar el archivo de usuarios:', error.message);
    return false;
  }
}

/**
 * Busca un usuario por su nombre de usuario (sin distinción de mayúsculas/minúsculas).
 * @param {string} usuario - Nombre de usuario a buscar
 * @returns {Object|null} Objeto de usuario o null si no se encuentra
 */
function findByUsername(usuario) {
  if (!usuario) return null;
  const users = getAllUsers();
  return users.find(u => u.usuario.toLowerCase() === usuario.trim().toLowerCase()) || null;
}

/**
 * Registra un nuevo usuario con contraseña cifrada (hash).
 * @param {Object} userData - Datos del usuario a registrar
 * @param {string} userData.usuario - Nombre de usuario
 * @param {string} userData.contrasena - Contraseña en texto plano
 * @param {string} [userData.nombreCompleto] - Nombre completo opcional
 * @returns {Object} Datos del usuario creado (excluyendo la contraseña)
 */
async function createUser({ usuario, contrasena, nombreCompleto }) {
  const users = getAllUsers();

  // Generar sal y encriptar contraseña con bcryptjs
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(contrasena, salt);

  // Crear objeto del nuevo usuario
  const newUser = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    usuario: usuario.trim(),
    nombreCompleto: nombreCompleto ? nombreCompleto.trim() : usuario.trim(),
    rol: 'Usuario',
    contrasena: hashedPassword,
    creadoEn: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);

  // Retornar información segura (sin el hash de la contraseña)
  const { contrasena: _, ...safeUser } = newUser;
  return safeUser;
}

/**
 * Compara una contraseña en texto plano contra un hash almacenado.
 * @param {string} plainPassword - Contraseña ingresada
 * @param {string} hashedPassword - Hash de contraseña guardado
 * @returns {Promise<boolean>} True si coinciden, false de lo contrario
 */
async function verifyPassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

module.exports = {
  getAllUsers,
  findByUsername,
  createUser,
  verifyPassword
};
