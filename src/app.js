/**
 * ============================================================================
 * EVIDENCIA: GA7-220501096-AA5-EV01 - Diseño y desarrollo de servicios web - caso
 * APRENDIZ: Iván Andrés Méndez Ardila
 * PROGRAMA: Análisis y Desarrollo de Software (ADSO) - SENA
 * ============================================================================
 * 
 * CONFIGURACIÓN DE LA APLICACIÓN EXPRESS (app.js)
 * Configura los middlewares globales, parser de JSON, CORS,
 * archivos estáticos de prueba y las rutas de la API REST.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middlewares Globales
app.use(cors()); // Habilita el intercambio de recursos de origen cruzado (CORS)
app.use(express.json()); // Permite recibir y procesar solicitudes con cuerpo JSON
app.use(express.urlencoded({ extended: true })); // Permite procesar datos de formularios

// Servir la interfaz web visual de pruebas desde la carpeta 'public'
app.use(express.static(path.join(__dirname, '../public')));

// Información general de la API
app.get('/api', (req, res) => {
  res.json({
    nombre: 'API de Autenticación y Registro de Usuarios',
    evidencia: 'GA7-220501096-AA5-EV01',
    aprendiz: 'Iván Andrés Méndez Ardila',
    institucion: 'Servicio Nacional de Aprendizaje (SENA)',
    version: '1.0.0',
    estado: 'Servicio en línea',
    endpoints: {
      registro: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      usuarios: 'GET /api/auth/users'
    },
    fecha: new Date().toISOString()
  });
});

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Manejo de ruta no encontrada (404)
app.use((req, res) => {
  res.status(404).json({
    exito: false,
    codigo: 404,
    mensaje: `La ruta solicitada '${req.originalUrl}' no existe en este servidor.`
  });
});

// Manejo global de errores imprevistos (500)
app.use((err, req, res, next) => {
  console.error('Error no controlado:', err.stack);
  res.status(500).json({
    exito: false,
    codigo: 500,
    mensaje: 'Se presentó un error inesperado en el servidor.',
    error: err.message
  });
});

module.exports = app;
