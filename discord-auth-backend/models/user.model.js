// Importamos mongoose para interactuar con la base de datos MongoDB
import mongoose from 'mongoose';

// Definición del esquema de usuario (UserSchema) utilizando mongoose
const UserSchema = new mongoose.Schema({
    // Campo para almacenar el correo electrónico del usuario
    email: {
        type: String, // El campo es de tipo cadena de texto
        required: true, // Es un campo obligatorio
        unique: true, // El correo debe ser único en la base de datos
        lowercase: true, // Convierte el correo a minúsculas automáticamente
        trim: true, // Elimina los espacios al principio y al final del correo
    },
    
    // Campo para almacenar la contraseña del usuario
    password: { 
        type: String, // El campo es de tipo cadena de texto
        validate: {
            // Validación personalizada para la contraseña
            validator: function(value) {
                // Si el usuario tiene un Discord ID, no se requiere una contraseña
                if (this.discordId) {
                    return true;  // Si tiene Discord ID, pasa la validación sin necesidad de contraseña
                }
                // Si no es usuario de Discord, se valida que la contraseña tenga al menos 6 caracteres
                return value && value.length > 6;  
            },
            // Mensaje de error si la validación falla
            message: 'Password should be at least 6 characters long'
        },
        required: function() {
            // Si el usuario no tiene un Discord ID, se hace obligatorio el campo de contraseña
            return !this.discordId;
        }
    },

    // Campo para almacenar el Discord ID del usuario (si existe)
    discordId: {
        type: String, // El campo es de tipo cadena de texto
        unique: true, // El Discord ID debe ser único
        sparse: true, // Permite que no todos los usuarios tengan un Discord ID (campo opcional)
    },

    // Campo para almacenar el nombre de usuario (si existe)
    username: String,

    // Campo para almacenar el avatar del usuario (si existe)
    avatar: String,

    // Campo para indicar si el usuario ha verificado su correo electrónico
    isVerified: {
        type: Boolean, // Es un campo booleano (true/false)
        default: false, // El valor predeterminado es false, indicando que el correo no está verificado
    },
    
}, { timestamps: true }); // La opción `timestamps` agrega los campos `createdAt` y `updatedAt` automáticamente

// Exportamos el modelo de usuario, que permite interactuar con la colección de usuarios en la base de datos
export default mongoose.model('User', UserSchema);
