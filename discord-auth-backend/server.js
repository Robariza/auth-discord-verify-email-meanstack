import express from 'express';  // Framework para crear el servidor web en Node.js
import passport from 'passport';  // Passport para gestionar la autenticación
import session from 'express-session';  // Middleware para gestionar sesiones
import mongoose from 'mongoose';  // Mongoose para interactuar con MongoDB
import dotenv from 'dotenv';  // dotenv para cargar las variables de entorno
import cors from 'cors';  // Middleware para habilitar CORS
import authRoutes from './routes/authDiscord.routes.js';  // Rutas de autenticación con Discord
import userRoutes from './routes/user.routes.js';  // Rutas relacionadas con usuarios
import './passport.js';  // Importar la configuración de Passport

// Cargar las variables de entorno desde el archivo .env
dotenv.config();  // Carga las variables de entorno para acceder a las configuraciones seguras

// Crear una instancia de la aplicación Express
const app = express();

// Middleware para convertir las peticiones en formato JSON
app.use(express.json());  // Permite recibir peticiones en formato JSON (para POST, PUT, etc.)

// Middleware para permitir peticiones de otros dominios (CORS)
app.use(cors());  // Permite que el frontend (por ejemplo, Angular) realice peticiones al backend

// Configuración de la sesión
app.use(
  session({
    secret: 'tu_clave_secreta',  // Clave secreta para firmar las sesiones, debe ser privada
    resave: false,  // No vuelve a guardar la sesión si no ha sido modificada
    saveUninitialized: false,  // No guarda sesiones nuevas si no han sido inicializadas
    cookie: {
      secure: process.env.NODE_ENV === 'production',  // Asegura que las cookies solo se usen en producción
      maxAge: 24 * 60 * 60 * 1000,  // La cookie expirará después de 24 horas
    },
  })
);

// Inicializar Passport para la autenticación
app.use(passport.initialize());  // Inicializa Passport en la aplicación Express
app.use(passport.session());  // Establece que Passport utilice las sesiones para almacenar la información del usuario

// Conectar a la base de datos MongoDB
mongoose.connect(process.env.MONGODB_URI)  // Usa la URI de conexión a MongoDB proporcionada en el archivo .env
  .then(() => console.log('Conectado a MongoDB'))  // Si la conexión es exitosa, se muestra el mensaje
  .catch(err => console.error('Error al conectar a MongoDB:', err));  // Si ocurre un error, se muestra el mensaje

// Definir las rutas de la API de usuario
app.use('/api/auth', userRoutes);  // Rutas relacionadas con la autenticación y gestión de usuarios

// Definir las rutas de autenticación con Discord
app.use('/auth/discord', authRoutes);  // Rutas que gestionan la autenticación a través de Discord

// Iniciar el servidor en el puerto configurado en las variables de entorno
app.listen(process.env.PORT, () => {
  console.log(`El servidor se está escuchando en el puerto: ${process.env.PORT}`);  // Muestra el mensaje indicando el puerto donde el servidor está en ejecución
});
