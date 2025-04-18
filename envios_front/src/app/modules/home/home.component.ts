import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { UserService } from '../../core/services/user/user.service';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [HeaderComponent, FooterComponent]
})
export class HomeComponent implements OnInit {
  username: string | undefined; // Variable para almacenar el nombre del usuario

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    const token = sessionStorage.getItem('token');
    if (token) {
      // Decodificar el token JWT
      const payload = JSON.parse(atob(token.split('.')[1]));

      // Extraemos el nombre del usuario (puedes ajustarlo según tu payload)
      this.username = payload.username || 'Usuario desconocido'; // Ajusta 'username' según el nombre de la propiedad en tu token
      console.log(payload);
      this.userService.getUserByEmail(payload.email).subscribe(user => {
        user.data
        if (user) {
          this.username = user.data.nombre; // Ajusta 'name' según la propiedad que contenga el nombre del usuario
        } else {
          this.username = 'Usuario desconocido';
        }
      }, error => {
        console.error('Error al obtener el usuario:', error);
        this.username = 'Usuario desconocido';
      });

      // Verificamos si el token está expirado
      const isExpired = Date.now() >= payload.exp * 1000;
      
      if (isExpired) {
        sessionStorage.removeItem('token');
        this.router.navigate(['/login']);
      }
    }
  }
}
