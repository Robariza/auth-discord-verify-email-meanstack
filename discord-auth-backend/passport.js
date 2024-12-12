import passport from 'passport';  // Passport es una librería de autenticación para Node.js
import { Strategy as DiscordStrategy } from 'passport-discord';  // Estrategia de autenticación con Discord
import User from './models/user.model.js';  // Modelo de usuario para interactuar con la base de datos
import dotenv from 'dotenv';  // dotenv carga variables de entorno desde el archivo .env

// Cargar las variables de entorno desde el archivo .env
dotenv.config();  // Asegúrate de que las variables de entorno están disponibles para su uso

// Configuración de Passport para usar la estrategia de Discord
passport.use(
    new DiscordStrategy(
        {
            clientID: process.env.DISCORD_CLIENT_ID,  // ID de cliente de Discord, obtenido de las variables de entorno
            clientSecret: process.env.DISCORD_CLIENT_SECRET,  // Secreto del cliente de Discord, obtenido de las variables de entorno
            callbackURL: process.env.DISCORD_CALLBACK_URL,  // URL a la que Discord redirige después de la autenticación
            scope: ['identify', 'email'],  // Los permisos requeridos para acceder a la información del usuario en Discord
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Intentar encontrar un usuario en la base de datos usando el discordId del perfil de Discord
                let user = await User.findOne({ discordId: profile.id });

                if (!user) {
                    // Si no existe un usuario, crear uno nuevo en la base de datos usando los datos de perfil de Discord
                    user = await User.create({
                        discordId: profile.id,  // ID de Discord del usuario
                        username: profile.username,  // Nombre de usuario de Discord
                        email: profile.email,  // Correo electrónico del usuario de Discord
                        avatar: profile.avatar,  // Avatar del usuario de Discord
                    });
                }

                // Llamar al callback `done` con el usuario encontrado o creado
                return done(null, user);
            } catch (error) {
                // Si ocurre un error, pasarlo al callback `done` para manejarlo
                return done(error, null);
            }
        }
    )
);

// Configuración para serializar el usuario (guardar solo el ID del usuario en la sesión)
passport.serializeUser((user, done) => {
    done(null, user.id);  // Guardamos el ID del usuario para poder recuperarlo luego
});

// Configuración para deserializar el usuario (recuperar al usuario completo usando el ID almacenado)
passport.deserializeUser(async (id, done) => {
    try {
        // Buscar al usuario en la base de datos utilizando el ID almacenado en la sesión
        const user = await User.findById(id);
        done(null, user);  // Llamar al callback `done` con el usuario recuperado
    } catch (error) {
        done(error, null);  // Si ocurre un error, pasarlo al callback `done`
    }
});

// Exportar la instancia configurada de passport
export default passport;
