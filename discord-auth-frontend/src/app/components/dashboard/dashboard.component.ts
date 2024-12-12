import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(private router: Router) {} // Inyecta el servicio Router para gestionar la navegación en la aplicación.

  // Método para cerrar sesión
  logout() {
    localStorage.removeItem('token'); // Elimina el token de autenticación del almacenamiento local, cerrando la sesión del usuario.
    this.router.navigate(['/login']); // Redirige al usuario a la página de login después de cerrar sesión.
  }
}