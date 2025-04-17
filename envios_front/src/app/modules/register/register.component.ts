import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Form, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule,  ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm !: FormGroup;

  document_type = [
    { value: '', name: 'Selecciona el tipo de documento' },
    { value: 'C.C', name: 'Cedula de Ciudadania' },
    { value: 'C.E', name: 'Cedula de Extrangeria' },
    { value: 'Pasaporte', name: 'Pasaporte' },
    { value: 'T.I', name: 'Tarjeta de Identidad' }
  ];
constructor(private fb: FormBuilder) {
  this.createForm();

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
    terms: [false, Validators.requiredTrue]
  }, { validator: this.passwordMatchValidator });
}
passwordMatchValidator(form: FormGroup) {
  const passwordControl = form.get('password');
  const confirmPasswordControl = form.get('confirmPassword');
  return passwordControl && confirmPasswordControl && passwordControl.value === confirmPasswordControl.value 
    ? null : { mismatch: true };
}

onSubmit() {
  if (this.registerForm.valid) {
    console.log('Form Submitted!', this.registerForm.value);
    // Here you would typically call a service to register the user
  } else {
    this.markFormGroupTouched(this.registerForm);
  }
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
