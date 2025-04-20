import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Excluir rutas públicas
    if (this.authService.isPublicUrl(request.url)) {
      return next.handle(request);
    }

    // Para rutas protegidas, agregar el token
    const token = this.authService.getToken();
    if (token && this.authService.checkTokenValidity()) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(request);
    } else {
      this.authService.logout();
      return next.handle(request);
    }
  }
}