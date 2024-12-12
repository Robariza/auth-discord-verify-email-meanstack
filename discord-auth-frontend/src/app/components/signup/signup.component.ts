import { Component } from '@angular/core'; 
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; // Importa las clases necesarias para crear y validar formularios reactivos.
import { Router } from '@angular/router'; // Importa Router para poder redirigir entre rutas en la aplicación.
import { AuthService } from '../../services/auth.service'; // Importa el servicio de autenticación para manejar el registro de usuarios.
import { CommonModule } from '@angular/common'; // Se importa CommonModule, que proporciona funcionalidades comunes para los módulos.

@Component({
  selector: 'app-signup', 
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // Importa los módulos necesarios para este componente, en este caso para formularios reactivos.
  templateUrl: './signup.component.html', 
  styleUrl: './signup.component.css' 
})
export class SignupComponent {
  signupForm: FormGroup; // Declara una variable signupForm que será utilizada para manejar el formulario reactivo.

  // El constructor se usa para inyectar las dependencias necesarias en el componente.
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    // Crea un formulario reactivo con los campos 'email' y 'password', con las validaciones correspondientes.
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // El campo 'email' es obligatorio y debe tener un formato de email válido.
      password: ['', [Validators.required, Validators.minLength(6)]], // El campo 'password' es obligatorio y debe tener al menos 6 caracteres.
    });
  }

  // Este método maneja el evento cuando el usuario envía el formulario de registro.
  onSignup() {
    // Verifica si el formulario es válido antes de continuar.
    if (this.signupForm.valid) {
      const { email, password } = this.signupForm.value; // Extrae los valores del formulario.

      // Llama al servicio de autenticación (AuthService) para registrar al usuario con los datos proporcionados.
      this.authService.register(email, password).subscribe(
        (response) => { // Si el registro es exitoso:
          alert('Registro exitoso. Verifica tu correo electrónico.'); // Muestra un mensaje de éxito al usuario.
          this.router.navigate(['/login']); // Redirige al usuario a la página de login.
        },
        (error) => { // Si ocurre un error durante el registro:
          console.error('Error en el registro:', error); // Muestra el error en la consola.
          alert(error.error.message || 'Error al registrar el usuario.'); // Muestra un mensaje de error al usuario.
        }
      );
    }
  }
}
