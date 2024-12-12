import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; // Se importa Router para poder redirigir entre rutas y RouterModule para manejar rutas en la aplicación.
import { CommonModule } from '@angular/common'; // Se importa CommonModule, que proporciona funcionalidades comunes para los módulos.
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; // Se importan las clases y módulos necesarios para crear formularios reactivos en Angular.
import { AuthService } from '../../services/auth.service'; // Se importa el servicio de autenticación para manejar las peticiones de login.

@Component({
  selector: 'app-login', 
  standalone: true, 
  imports: [CommonModule, ReactiveFormsModule, RouterModule], // Se importan los módulos necesarios para el componente (manejo de formularios reactivos y enrutamiento).
  templateUrl: './login.component.html', 
  styleUrl: './login.component.css' 
})
export class LoginComponent {
  loginForm: FormGroup; // Variable que mantiene la estructura del formulario reactivo.
  errorMessage: string | null = null; // Variable para manejar los errores que puedan ocurrir durante el login.

  // El constructor se utiliza para inyectar las dependencias necesarias en el componente.
  constructor(
    private fb: FormBuilder, // FormBuilder se usa para crear formularios reactivos de manera más fácil.
    private authService: AuthService, // Se inyecta el servicio de autenticación para hacer la solicitud de login.
    private router: Router // Se inyecta el router para navegar entre rutas.
  ) {
    // Se crea un formulario reactivo utilizando FormBuilder.
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Se configura el campo 'email' para que sea requerido y tenga un formato de email.
      password: ['', [Validators.required]], // Se configura el campo 'password' para que sea requerido.
    });
  }

  // Función que maneja el evento de inicio de sesión (login).
  onLogin() {
    if (this.loginForm.invalid) return; // Si el formulario es inválido, no realiza la solicitud.

    const { email, password } = this.loginForm.value; // Se extraen los valores del formulario.

    // Llama al servicio de autenticación (AuthService) para hacer la solicitud de login.
    this.authService.login(email, password).subscribe({
      next: (response) => { // Si la solicitud es exitosa:
        localStorage.setItem('token', response.token); // Se guarda el token en el almacenamiento local del navegador.
        this.router.navigate(['/dashboard']); // Se redirige al usuario al dashboard.
      },
      error: (err) => { // Si ocurre un error durante la solicitud:
        this.errorMessage = err.error.message || 'Error al iniciar sesión'; // Se muestra un mensaje de error.
      },
    });
  }

  // Función para manejar el login con Discord.
  onDiscordLogin() {
    window.location.href = 'http://localhost:3000/auth/discord'; // Redirige al usuario a la URL de autenticación con Discord.
  }
}
