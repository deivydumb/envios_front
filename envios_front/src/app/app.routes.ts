import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { RegisterComponent } from '../app/modules/register/register.component';
import { NgModule } from '@angular/core';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegisterComponent },

  { path: 'home', loadComponent: () => import('./modules/home/home.component').then(m => m.HomeComponent), canActivate: [AuthGuard] },
  { path: 'homeAdmin', loadComponent: () => import('./modules/home-admin/home-admin.component').then(m => m.HomeAdminComponent), canActivate: [AuthGuard] },
  { path: 'journey', loadComponent: () => import('./modules/journey/journey.component').then(m => m.JourneyComponent), canActivate: [AuthGuard] },
  { path: 'envios', loadComponent: () => import('./modules/shipment/shipment.component').then(m => m.ShipmentComponent), canActivate: [AuthGuard] },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];

  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }