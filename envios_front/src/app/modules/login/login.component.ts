import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ]
})
export class LoginComponent {
  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    // Verificar si ya hay un token válido
    if (this.authService.checkTokenValidity()) {
      // Si el token es válido, redirigir al home
      this.router.navigate(['/home']);
    }
  }

  onSubmit(): void {
    const { email, password } = this.loginForm.value;
    console.log("Formulario", email, password);

    this.authService.login(email, password).subscribe({
      next: (response) => {
        if (response.token) {
          sessionStorage.setItem('token', response.token);
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Credenciales inválidas';
      }
    });
  }
}
