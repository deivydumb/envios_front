import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  private publicEndpoints = [
    `${this.apiUrl}/login`,
    `${this.apiUrl}/users/email/`,
    `${this.apiUrl}/users` // POST para creación de usuario
  ];

  constructor(private http: HttpClient, private router: Router) {}

  // Método para verificar si una URL es pública
  isPublicUrl(url: string): boolean {
    return this.publicEndpoints.some(endpoint => {
      if (endpoint.endsWith('/')) {
        return url.includes(endpoint);
      }
      return url === endpoint;
    });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        if (response.token) {
          this.storeToken(response.token);
        }
      })
    );
  }

  checkEmail(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/email/${email}`);
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, userData);
  }

  private storeToken(token: string): void {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('token', token);
    }
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  logout(): void {
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  checkTokenValidity(): boolean {
    const token = this.getToken();
    
    if (!token) return false;

    try {
      const decodedToken = this.decodeToken(token);
      const expirationTime = decodedToken.exp * 1000;

      if (Date.now() > expirationTime) {
        this.logout();
        return false;
      }

      return true;
    } catch (e) {
      this.logout();
      return false;
    }
  }

  private decodeToken(token: string): any {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Token inválido');
    return JSON.parse(atob(parts[1]));
  }
}