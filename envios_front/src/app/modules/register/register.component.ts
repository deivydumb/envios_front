import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user/user.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule,  ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  @ViewChild('termsModal') termsModal!: ElementRef;
  registerForm !: FormGroup;
  document_type = [
    { value: '', name: 'Selecciona el tipo de documento' },
    { value: 'C.C', name: 'Cedula de Ciudadania' },
    { value: 'C.E', name: 'Cedula de Extrangeria' },
    { value: 'Pasaporte', name: 'Pasaporte' },
    { value: 'T.I', name: 'Tarjeta de Identidad' }
  ];
  showLoading: boolean = false;
constructor(private fb: FormBuilder,private router: Router ,private userService: UserService) {
  this.createForm();

}

ngOnInit(){
  this.userService.getUserByEmail("tets@test.com").subscribe(users => {
    console.log(users);
  });
}

createForm(){
  this.registerForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    identificacion: ['',  [Validators.required, Validators.minLength(5), Validators.maxLength(10)]],
    document_type:['',  [Validators.required]],
    telefono: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],
    rol : ['user'],
  }, { validator: this.passwordMatchValidator });
}
passwordMatchValidator(form: FormGroup) {
  const passwordControl = form.get('password');
  const confirmPasswordControl = form.get('confirmPassword');
  return passwordControl && confirmPasswordControl && passwordControl.value === confirmPasswordControl.value 
    ? null : { mismatch: true };
}

onSubmit() {
  this.showLoading = true;
  if (this.registerForm.invalid) {
    this.markFormGroupTouched(this.registerForm);
    this.showLoading = false;
    return;
  }
  const userData = this.registerForm.value;
  this.userService.getUserByEmail(userData.email).subscribe({
    next: user => {
      alert('El usuario ya está registrado');
      this.showLoading = false;
    },
    error: err => {
      if (err.status === 404) {
        this.userService.creationUser(userData).subscribe({
          next: (res: any) => {
            setTimeout(() => {
              sessionStorage.setItem('bandera', "true");
              this.router.navigate(['/login']);
            }, 3000);
          },
          error: createErr => {
            console.error('Error creando usuario', createErr);
            this.showLoading = false;
          }
        });
      } else {
        console.error('Error comprobando existencia de usuario', err);
        this.showLoading = false;
      }
    }
  });
}

  

markFormGroupTouched(formGroup: FormGroup) {
  Object.values(formGroup.controls).forEach(control => {
    control.markAsTouched();
    if (control instanceof FormGroup) {
      this.markFormGroupTouched(control);
    }
  });
}

}
