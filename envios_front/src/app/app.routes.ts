import { Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { RegisterComponent } from '../app/modules/register/register.component';

export const routes: Routes = [
        { path: '', component: LoginComponent }, // Ensure RegistriComponent exists in the specified path
        { path: 'registro', component: RegisterComponent },
        { path: '**', redirectTo: '' }
      ];