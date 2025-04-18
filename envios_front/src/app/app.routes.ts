import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { RegisterComponent } from '../app/modules/register/register.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
        { path: 'login', component: LoginComponent }, // Ensure RegistriComponent exists in the specified path
        { path: 'registro', component: RegisterComponent },
        {path : 'home', loadComponent: () => import('./modules/home/home.component').then(m => m.HomeComponent)},
        { path: '', redirectTo: '/login', pathMatch: 'full' },
        { path: '**', redirectTo: 'login' }
      ];

  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }