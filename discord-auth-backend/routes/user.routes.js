import express from 'express'; // Express es un framework para crear aplicaciones web, incluyendo rutas y servidores HTTP
import { registerUser, verifyEmail, loginUser } from '../controllers/auth.controller.js'; 
// Importamos los controladores de autenticación que contienen la lógica de negocio para el registro, login y verificación de correo

// Creamos una nueva instancia del enrutador de Express
const router = express.Router();

// Ruta para el registro de usuarios
// Este endpoint se utilizará para registrar nuevos usuarios en la aplicación
// Los datos del nuevo usuario (email y contraseña) se enviarán en el cuerpo de la solicitud (req.body)
router.post('/register', registerUser);

// Ruta para login con email y contraseña
// Este endpoint permitirá a los usuarios ya registrados autenticarse en la aplicación
// Se verificará la autenticidad del correo y la contraseña enviados en la solicitud
router.post('/login', loginUser);

// Ruta para verificar el correo electrónico
// Este endpoint se utiliza para verificar la cuenta de un usuario mediante un token de verificación de correo electrónico
// El token generalmente se envía como parámetro de consulta (query parameter)
router.get('/verify-email', verifyEmail);

// Exportamos el router para que pueda ser utilizado en otras partes de la aplicación (por ejemplo, en el archivo principal de la aplicación)
export default router;
