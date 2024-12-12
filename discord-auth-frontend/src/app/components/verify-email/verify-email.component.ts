import { Component, OnInit } from '@angular/core'; 
import { ActivatedRoute, Router } from '@angular/router'; // Importa ActivatedRoute y Router para manejar rutas y obtener parámetros de la URL.
import { AuthService } from '../../services/auth.service'; // Importa el servicio AuthService para interactuar con la autenticación de usuarios.
import { CommonModule } from '@angular/common'; // Importa CommonModule, que es necesario para usar directivas comunes como ngIf, ngFor en el template.

@Component({
  selector: 'app-verify-email', 
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './verify-email.component.html', 
  styleUrl: './verify-email.component.css' 
})
export class VerifyEmailComponent implements OnInit {
  message: string | null = null; // Declara una propiedad 'message' que se usará para mostrar mensajes de error o éxito.

  // El constructor inyecta las dependencias necesarias: ActivatedRoute (para obtener parámetros de la URL), AuthService (para interactuar con la API de autenticación) y Router (para redirigir al usuario).
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  // ngOnInit es un método del ciclo de vida del componente que se ejecuta al inicializar el componente.
  ngOnInit() {
    // Obtiene el parámetro 'token' de la URL usando ActivatedRoute.
    const token = this.route.snapshot.queryParamMap.get('token');
    
    // Si se proporciona un token en la URL, realiza la verificación del correo.
    if (token) {
      // Llama al servicio AuthService para verificar el correo electrónico con el token.
      this.authService.verifyEmail(token).subscribe({
        next: (response) => {
          // Si la verificación es exitosa, muestra el mensaje de éxito.
          this.message = response.message;
          // Después de 3 segundos, redirige al usuario a la página de login.
          setTimeout(() => this.router.navigate(['/login']), 3000);
        },
        error: (err) => {
          // Si ocurre un error, muestra el mensaje de error.
          this.message = err.error.message || 'Error verificando el correo';
        },
      });
    } else {
      // Si no se proporciona un token en la URL, muestra un mensaje de error.
      this.message = 'Token de verificación no proporcionado.';
    }
  }
}
