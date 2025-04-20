import { Component } from '@angular/core';
import { FooterComponent } from "../home/components/footer/footer.component";
import { HeaderComponent } from "../home/components/header/header.component";
import { Router } from '@angular/router';
import { JourneyComponent } from "../journey/journey.component";
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-home-admin',
  standalone: true,
  imports: [FooterComponent, HeaderComponent, JourneyComponent, NgIf],
  templateUrl: './home-admin.component.html',
  styleUrl: './home-admin.component.css'
})



export class HomeAdminComponent {

  constructor(private router: Router) {}
  username: string = 'Administrador';
  showjourney = false;

  navegationForJourney(){
    this.showjourney = true;
  }
  navigateTo(): void {
    this.showjourney = true;
  }


  handleElement(){
    console.log("EMIT")
    this.showjourney= false
  }
}

