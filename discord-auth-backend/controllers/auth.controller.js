import bcrypt from 'bcrypt'; // Librería para el hashing de contraseñas
import jwt from 'jsonwebtoken'; // Librería para crear y verificar tokens JWT
import User from '../models/user.model.js'; // Modelo de usuario para interactuar con la base de datos
import { sendVerificationEmail } from '../utils/emailVerification.util.js'; // Función para enviar el correo de verificación

// Registro de usuario utilizando correo y contraseña
export const registerUser = async (req, res) => {
    const { email, password } = req.body; // Extraemos el correo y la contraseña del cuerpo de la solicitud

    try {
        // Validamos si el correo y la contraseña fueron proporcionados
        if (!email || !password) {
            return res.status(400).json({ message: 'Email y contraseña son requeridos.' });
        }

        // Verificamos si ya existe un usuario con el mismo correo
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'El correo ya está registrado. Por favor inicia sesión.' });
        }

        // Encriptamos la contraseña con bcrypt utilizando 10 rondas de "salt"
        const hashedPassword = await bcrypt.hash(password, 10);

        // Creamos un nuevo usuario con el correo y la contraseña encriptada
        const newUser = new User({
            email,
            password: hashedPassword,
        });

        // Guardamos el nuevo usuario en la base de datos
        await newUser.save();

        // Generamos un token JWT para verificar el correo
        const verificationToken = jwt.sign(
            { email: newUser.email }, // El payload del token contiene el correo del usuario
            process.env.JWT_SECRET, // La clave secreta para firmar el token
            { expiresIn: '1h' } // El token tiene una validez de 1 hora
        );

        // Generamos el enlace de verificación usando el token generado
        const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${encodeURIComponent(verificationToken)}`;

        // Enviamos el correo de verificación con el enlace generado
        await sendVerificationEmail(email, verificationLink);

        // Enviamos una respuesta al cliente indicando que el registro fue exitoso
        res.status(201).json({ message: 'Usuario Registrado. Por favor verifica tu correo electrónico.' });
    } catch (error) {
        // Si ocurre algún error, lo logueamos y respondemos con un error 500
        console.error(error);
        res.status(500).json({ message: 'Error al registrar el usuario.' });
    }
};

// Login de usuario con correo y contraseña
export const loginUser = async (req, res) => {
    const { email, password } = req.body; // Extraemos el correo y la contraseña de la solicitud

    try {
        // Buscamos al usuario en la base de datos por correo
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Correo o contraseña incorrectos.' });
        }

        // Comparamos la contraseña ingresada con la almacenada en la base de datos
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Correo o contraseña incorrectos.' });
        }

        // Generamos un token JWT para el usuario con una validez de 1 día
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '1d', // El token expirará en 1 día
        });

        // Devolvemos una respuesta exitosa con el token generado
        res.status(200).json({ message: 'Autenticación exitosa', token });
    } catch (error) {
        // Si ocurre un error, lo logueamos y respondemos con un error 500
        console.error(error);
        res.status(500).json({ message: 'Error de autenticación.' });
    }
};

// Verificación de correo electrónico mediante el token de verificación
export const verifyEmail = async (req, res) => {
    const { token } = req.query; // Extraemos el token de la consulta (query) de la URL

    try {
        // Verificamos el token JWT utilizando la clave secreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Buscamos al usuario por el correo contenido en el token
        const user = await User.findOne({ email: decoded.email });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Verificamos si el usuario ya ha sido verificado
        if (user.isVerified) {
            return res.status(400).json({ message: 'El correo ya ha sido verificado.' });
        }

        // Si el usuario no está verificado, lo marcamos como verificado
        user.isVerified = true;
        await user.save();

        // Devolvemos una respuesta exitosa indicando que la verificación fue exitosa
        res.status(200).json({ message: 'Correo verificado exitosamente.' });
    } catch (error) {
        // Manejamos diferentes tipos de errores relacionados con la verificación del token
        console.error('Error verificando el token:', error);

        // Error cuando el token ha expirado
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ message: 'Token expirado' });
        }
        // Error cuando el token es malformado o inválido
        if (error.name === 'JsonWebTokenError') {
            return res.status(400).json({ message: 'Token malformado o inválido' });
        }
        // Si el error no es específico, se responde con un mensaje genérico
        res.status(400).json({ message: 'Token inválido o expirado' });
    }
};

// Login con Discord (autenticación mediante OAuth)
export const discordLogin = (req, res) => {
    const user = req.user; // El usuario es proporcionado por el middleware de Discord

    // Generamos un token JWT para el usuario autenticado con Discord
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '1d', // El token tiene una validez de 1 día
    });

    // Devolvemos una respuesta exitosa con el token generado
    res.status(200).json({ message: 'Autenticación exitosa con Discord', token });
};
