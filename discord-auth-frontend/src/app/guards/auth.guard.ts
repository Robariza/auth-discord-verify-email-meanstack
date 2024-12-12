import { inject } from '@angular/core'; // Importa la función 'inject' para inyectar servicios en funciones no-clase.
import { Router } from '@angular/router'; // Importa el servicio Router de Angular para manejar la navegación de rutas.
import { CanActivateFn } from '@angular/router'; // Importa CanActivateFn, que es un tipo de función utilizada en las guardias de ruta.

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router); // Inyecta el servicio Router para poder usarlo dentro de la función.
  const token = localStorage.getItem('token'); // Obtiene el token de acceso almacenado en localStorage.

  if (token) {
    return true; // Si el token está presente (usuario autenticado), permite el acceso a la ruta.
  } else {
    router.navigate(['/login']); // Si no hay token (usuario no autenticado), redirige al login.
    return false; // Bloquea el acceso a la ruta.
  }
};
