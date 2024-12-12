import nodemailer from 'nodemailer';  // Nodemailer se usa para enviar correos electrónicos desde Node.js
import dotenv from 'dotenv';  // dotenv permite cargar variables de entorno desde un archivo .env

// Cargar las variables de entorno definidas en el archivo .env
dotenv.config();  // Asegúrate de que las variables de entorno están cargadas antes de usarlas

// Configuración de Mailtrap (o cualquier otro servicio de correo)
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,  // Dirección del servidor SMTP, extraída de las variables de entorno
    port: process.env.EMAIL_PORT,  // Puerto del servidor SMTP (usualmente 587 para TLS o 465 para SSL)
    auth: {
        user: process.env.EMAIL_USER,  // Usuario de autenticación del servidor SMTP, extraído de las variables de entorno
        pass: process.env.EMAIL_PASS,  // Contraseña de autenticación del servidor SMTP, extraída de las variables de entorno
    },
    tls: {
        rejectUnauthorized: false,  // Permite conexiones TLS incluso si el servidor no tiene un certificado válido (en producción, puede ser peligroso)
    },
});

// Verificar la conexión con el servidor SMTP
transporter.verify((error, success) => {
    if (error) {
        console.error('Error de conexión con Mailtrap:', error);  // Si ocurre un error, lo mostramos en consola
    } else {
        console.log('Conexión con Mailtrap exitosa');  // Si la conexión es exitosa, lo confirmamos en consola
    }
});

// Función para enviar el correo de verificación
// Esta función se invoca cuando el sistema necesita enviar un correo con un enlace de verificación
export const sendVerificationEmail = async (email, verificationLink) => {
    // Definimos las opciones del correo (de, para, asunto y cuerpo del mensaje)
    const mailOptions = {
        from: process.env.EMAIL_USER,  // Remitente, que debe ser un correo electrónico configurado en las variables de entorno
        to: email,  // Destinatario, el correo electrónico del usuario al que se enviará el mensaje
        subject: 'Verifique su dirección de correo electrónico',  // Asunto del correo
        html: `<p>Click <a href="${verificationLink}">here</a> to verify your email address.</p>`,  // Cuerpo del correo en formato HTML, que contiene un enlace de verificación
    };

    try {
        // Enviamos el correo utilizando el método sendMail de Nodemailer
        await transporter.sendMail(mailOptions);
        console.log('Correo de verificación enviado exitosamente');  // Si el correo se envía sin problemas, se muestra un mensaje en consola
    } catch (error) {
        // Si hay algún error al enviar el correo, lo capturamos y mostramos en consola
        console.error('Error al enviar el correo de verificación:', error);
        console.error('Detalles del error:', error.stack);  // Mostramos el stack del error para obtener más detalles de lo que salió mal
    }
};
