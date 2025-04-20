import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { UserService } from '../../core/services/user/user.service';
import { ShipmentComponent } from "../shipment/shipment.component";
import { NgIf } from '@angular/common';
import { NotificationService } from '../../core/services/notifications/notifications.service';


@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [HeaderComponent, FooterComponent, ShipmentComponent, NgIf]
})
export class HomeComponent implements OnInit {
  username: string | undefined; 
  showShipment = false;
  showToast = false;
  toastMessage = "creado con exito el envio";
  toastType = 'success';
  private timer: any;

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {
   this.checkFlag();
    const token = sessionStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));

      this.username = payload.username || 'Usuario desconocido';
      this.userService.getUserByEmail(payload.email).subscribe(user => {
        if (user && user.data) {
          this.username = user.data.nombre; 
        } else {
          this.username = 'Usuario desconocido';
        }
      }, error => {
        console.error('Error al obtener el usuario:', error);
        this.username = 'Usuario desconocido';
      });

      const isExpired = Date.now() >= payload.exp * 1000;
      
      if (isExpired) {
        sessionStorage.removeItem('token');
        this.router.navigate(['/login']);
      }
    }
  }
  
  checkFlag() {
    const flag = sessionStorage.getItem('bandera');
    console.log('Valor de la bandera:', flag);
    // Convertir a booleano (considerando 'true' como string)
    this.showToast = flag === 'true';
    
    // Si la bandera está activa, programar desactivación
    if (this.showToast) {
      this.timer = setTimeout(() => {
        this.showToast = false;
        sessionStorage.removeItem('bandera'); // Opcional: eliminar el valor
      }, 5000);
    }
  }

  toggleShipment(): void {
    this.showShipment =true;
  }


 
}
