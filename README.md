# Evidencia GA7-220501096-AA5-EV01: Diseño y desarrollo de servicios web - caso

![Node.js](https://img.shields.io/badge/Node.js-v24+-green?logo=node.js)
![Express](https://img.shields.io/badge/Express-v4.21-blue?logo=express)
![Bcrypt](https://img.shields.io/badge/Seguridad-bcryptjs-red)
![SENA](https://img.shields.io/badge/SENA-ADSO-39a900)

---

## 📌 Información del Aprendiz y Evidencia

- **Programa de Formación:** Análisis y Desarrollo de Software (ADSO)
- **Regional / Centro:** Servicio Nacional de Aprendizaje - SENA
- **Nombre del Aprendiz:** Iván Andrés Méndez Ardila
- **Código de la Evidencia:** `GA7-220501096-AA5-EV01`
- **Nombre de la Evidencia:** Diseño y desarrollo de servicios web - caso

---

## 🎯 Descripción del Caso y Requisitos Cumplidos

Tomando como referencia lo visto en el componente formativo **"Construcción API"**, se realizó el diseño y la codificación de un servicio web RESTful utilizando **Node.js** y **Express.js** que cubre los siguientes requerimientos:

1. **Servicio Web para Registro y Autenticación (Login):**
   - Recibe credenciales (`usuario` y `contrasena`).
   - Si la autenticación es correcta: responde con código **200 OK** y el mensaje **`"Autenticación satisfactoria"`**.
   - En caso contrario: responde con código **401 Unauthorized** y el mensaje **`"Error en la autenticación"`**.
2. **Código Comentado:**
   - Todo el código fuente cuenta con comentarios descriptivos detallando cada módulo, middleware, función y controlador.
3. **Control de Versiones:**
   - Proyecto estructurado y versionado con Git (`git init`, commits estructurados, `.gitignore`).
4. **Lineamientos de Entrega:**
   - Generación del archivo comprimido `IVAN_MENDEZ_AA5_EV01.zip`.
   - Inclusión del archivo `ENLACE_REPOSITORIO.txt`.

---

## 🏗️ Arquitectura del Proyecto

El proyecto sigue una arquitectura en capas, modular y escalable:

```text
GA7-220501096-AA5-EV01/
│
├── data/
│   └── users.json                  # Almacenamiento local persistente con hashes bcrypt
│
├── public/                         # Interfaz web visual para pruebas en navegador
│   ├── index.html                  # Dashboard interactivo con formularios y consola HTTP
│   ├── style.css                   # Hoja de estilos moderna y responsiva
│   └── app.js                      # Consumo de la API con Fetch API
│
├── src/
│   ├── controllers/
│   │   └── authController.js       # Lógica de login, registro y listado de usuarios
│   ├── middlewares/
│   │   └── validationMiddleware.js # Validación de campos obligatorios y formato
│   ├── models/
│   │   └── userModel.js            # Modelo de datos, lectura/escritura y cifrado
│   ├── routes/
│   │   └── authRoutes.js           # Definición de rutas y endpoints de la API
│   ├── app.js                      # Configuración de Express, CORS y middlewares
│   └── server.js                   # Arranque del servidor HTTP (Puerto 3000)
│
├── test/
│   └── auth.test.js                # Batería automatizada de pruebas unitarias/integración
│
├── .gitignore                      # Exclusión de node_modules y archivos temporales
├── ENLACE_REPOSITORIO.txt          # Documento de entrega para el evaluador SENA
├── package.json                    # Dependencias y scripts de ejecución
├── postman_collection.json         # Colección lista para importar en Postman
└── README.md                       # Documentación técnica completa
```

---

## 🚀 Instalación y Puesta en Marcha

### Prerrequisitos
- Tener instalado **Node.js** (versión 18 o superior).

### 1. Clonar o Descomprimir el Proyecto
```bash
git clone https://github.com/IvanMendezArdila/sena-ga7-aa5-ev01-servicio-web-autenticacion.git
cd GA7-220501096-AA5-EV01
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Iniciar el Servidor
```bash
npm start
```

El servicio estará disponible en:
- **Consola / API:** `http://localhost:3000`
- **Interfaz Web Interactiva:** `http://localhost:3000`
- **Información de la API:** `http://localhost:3000/api`

---

## 🧪 Pruebas Automatizadas

El proyecto incluye una suite de pruebas que valida los 8 casos de prueba principales:
```bash
npm test
```

### Casos validados:
1. `GET /api` -> Retorna información y autor Iván Andrés Méndez Ardila.
2. `POST /api/auth/register` -> Registro exitoso con status 201.
3. `POST /api/auth/register` -> Detección y rechazo de usuario duplicado con status 409.
4. `POST /api/auth/register` -> Validación de campos vacíos con status 400.
5. `POST /api/auth/login` -> **Autenticación satisfactoria** con credenciales válidas (Status 200).
6. `POST /api/auth/login` -> **Error en la autenticación** por contraseña incorrecta (Status 401).
7. `POST /api/auth/login` -> **Error en la autenticación** por usuario inexistente (Status 401).
8. `GET /api/auth/users` -> Listado de usuarios activos (Status 200).

---

## 📡 Especificación de los Endpoints de la API

### 1. Inicio de Sesión (Login)
- **Método:** `POST`
- **Ruta:** `/api/auth/login`
- **Descripción:** Valida las credenciales ingresadas contra la base de datos.

#### Ejemplo de Solicitud (Headers: `Content-Type: application/json`):
```json
{
  "usuario": "ivan.mendez",
  "contrasena": "sena2026"
}
```

#### Respuesta Exitosa (200 OK):
```json
{
  "exito": true,
  "codigo": 200,
  "mensaje": "Autenticación satisfactoria",
  "datos": {
    "id": 1,
    "usuario": "ivan.mendez",
    "nombreCompleto": "Iván Andrés Méndez Ardila",
    "rol": "Aprendiz SENA",
    "ultimoAcceso": "2026-09-25T16:30:00.000Z"
  }
}
```

#### Respuesta Fallida (401 Unauthorized):
```json
{
  "exito": false,
  "codigo": 401,
  "mensaje": "Error en la autenticación: Credenciales inválidas. Contraseña incorrecta.",
  "fecha": "2026-09-25T16:30:00.000Z"
}
```

---

### 2. Registro de Usuario
- **Método:** `POST`
- **Ruta:** `/api/auth/register`
- **Descripción:** Registra un nuevo usuario cifrando su contraseña con **bcryptjs** (10 rondas de salt).

#### Ejemplo de Solicitud:
```json
{
  "usuario": "carlos.gomez",
  "contrasena": "claveSegura2026",
  "nombreCompleto": "Carlos Gómez"
}
```

#### Respuesta Exitosa (201 Created):
```json
{
  "exito": true,
  "codigo": 201,
  "mensaje": "Registro satisfactorio: El usuario ha sido registrado exitosamente.",
  "usuario": {
    "id": 2,
    "usuario": "carlos.gomez",
    "nombreCompleto": "Carlos Gómez",
    "rol": "Usuario",
    "creadoEn": "2026-09-25T16:31:00.000Z"
  }
}
```

---

### 3. Consulta de Usuarios
- **Método:** `GET`
- **Ruta:** `/api/auth/users`
- **Descripción:** Devuelve la lista de usuarios registrados sin exponer información sensible ni contraseñas.

---

## 🔒 Buenas Prácticas de Seguridad Implementadas

1. **Cifrado Hash con Sal (Bcrypt):** Las contraseñas nunca se almacenan en texto plano. Se utiliza `bcryptjs` con 10 rondas de salting criptográfico.
2. **Validación de Entradas:** Middleware que intercepta inyecciones de datos vacíos o tipos erróneos antes de llegar al controlador.
3. **Manejo Centralizado de Errores:** Códigos de estado HTTP semánticos (200, 201, 400, 401, 404, 409, 500).
4. **Seguridad en Respuestas:** Las contraseñas o hashes nunca se devuelven en las respuestas JSON a los clientes.

---

## 📦 Herramientas de Prueba Incluidas

- **Interfaz Gráfica en el Navegador:** Al ejecutar el proyecto, ingrese a `http://localhost:3000` para probar los formularios y ver la consola HTTP en vivo.
- **Colección de Postman:** Importe el archivo `postman_collection.json` en Postman para ejecutar todas las solicitudes preconfiguradas con un solo clic.

---

*Servicio Nacional de Aprendizaje (SENA) - 2026*
