import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api'; // Cambia esto por la URL de tu API

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: { token: string; }) => {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('token', response.token);
        }
      })
    );
  }
  

  checkTokenValidity(): boolean {
    const token = sessionStorage.getItem('token');
    
    if (!token) {
      return false; // No hay token
    }

    try {
      // Verificamos si el token es válido
      const decodedToken = this.decodeToken(token);
      const expirationTime = decodedToken.exp * 1000; // Convertimos el tiempo de expiración a milisegundos

      if (Date.now() > expirationTime) {
        // Si el token ha expirado, lo eliminamos y redirigimos al login
        sessionStorage.removeItem('token');
        this.router.navigate(['/login']);
        return false;
      }

      return true;
    } catch (e) {
      // Si el token no es válido, lo eliminamos y redirigimos al login
      sessionStorage.removeItem('token');
      this.router.navigate(['/login']);
      return false;
    }
  }

  private decodeToken(token: string): any {
    // Decodifica el JWT para obtener sus datos
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Token inválido');
    }

    const decoded = atob(parts[1]);
    return JSON.parse(decoded);
  }
}
