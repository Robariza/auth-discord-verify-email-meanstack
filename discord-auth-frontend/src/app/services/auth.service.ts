import { Injectable } from '@angular/core'; // Importa el decorador Injectable para que Angular pueda inyectar esta clase como un servicio.
import { HttpClient } from '@angular/common/http'; // Importa el servicio HttpClient para realizar peticiones HTTP.
import { Observable } from 'rxjs'; // Importa Observable de RxJS, que se utiliza para manejar las respuestas asíncronas.

@Injectable({
  providedIn: 'root', 
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth'; // URL base de la API para las rutas de autenticación.

  constructor(private http: HttpClient) {} // Inyecta el servicio HttpClient para realizar las peticiones HTTP.

  // Método para iniciar sesión con email y contraseña
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }); // Realiza una petición POST al endpoint de login de la API.
  }

  // Método para obtener la información del usuario autenticado usando un token
  getUserInfo(token: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user`, {
      headers: { Authorization: `Bearer ${token}` }, // Añade el token al encabezado Authorization para autenticar la solicitud.
    });
  }

  // Método para verificar el email del usuario mediante un token de verificación
  verifyEmail(token: string): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/api/auth/verify-email?token=${token}`); // Realiza una petición GET para verificar el email usando el token.
  }

  // Método para registrar un nuevo usuario
  register(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, { email, password }); // Realiza una petición POST al endpoint de registro de la API.
  }  
}
