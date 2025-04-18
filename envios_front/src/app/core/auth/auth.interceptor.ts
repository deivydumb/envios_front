// auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private excludedRoutes: string[] = [
    '/api/users',   // Crear usuario
    '/api/login'    // Login
  ];

  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.isExcluded(req.url)) {
      console.log ('Excluyendo la ruta:', req.url);
      console.log ('Excluyendo la ruta:', req.body);
      return next.handle(req);
    }

    const token = localStorage.getItem('token'); // o donde guardes el JWT

    if (token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(cloned).pipe(
        catchError(err => this.handleAuthError(err))
      );
    }

    return next.handle(req);
  }

  private isExcluded(url: string): boolean {
    return this.excludedRoutes.some(route => url.includes(route));
  }

  private handleAuthError(err: HttpErrorResponse): Observable<never> {
    if (err.status === 401 || err.status === 403) {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }
    return throwError(() => err);
  }
}
