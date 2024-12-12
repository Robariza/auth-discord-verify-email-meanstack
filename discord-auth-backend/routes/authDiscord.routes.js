import express from 'express'; // Express es el framework para la creación de rutas y servidores HTTP
import passport from 'passport'; // Passport es una biblioteca para la autenticación, en este caso, con Discord

// Creamos una nueva instancia de un enrutador de Express
const router = express.Router();

// Ruta para iniciar la autenticación con Discord
// Esta ruta es la que el usuario visita para iniciar el proceso de autenticación con Discord
router.get('/', passport.authenticate('discord'));

// Ruta de callback donde Discord redirige después de la autenticación
// Una vez que el usuario ha iniciado sesión en Discord, Discord redirige al callback
router.get('/callback',
    // Passport utiliza el mecanismo de autenticación de Discord. Si la autenticación falla, redirige al inicio.
    passport.authenticate('discord', { failureRedirect: '/' }), 

    // Si la autenticación es exitosa, ejecuta la función callback
    (req, res) => {
        // Redirige al usuario al dashboard después de la autenticación exitosa
        // En este caso, se redirige a la URL del frontend donde está la página de dashboard
        res.redirect(`${process.env.FRONTEND_URL}/dashboard`);  
    }
);

// Exportamos el enrutador para que se pueda utilizar en otras partes de la aplicación
export default router;
