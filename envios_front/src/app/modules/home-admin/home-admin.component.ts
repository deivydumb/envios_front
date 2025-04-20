import { Component, OnInit } from '@angular/core';
import { FooterComponent } from "../home/components/footer/footer.component";
import { HeaderComponent } from "../home/components/header/header.component";
import { Router } from '@angular/router';
import { JourneyComponent } from "../journey/journey.component";
import { NgIf } from '@angular/common';
import { PackageAssigmentComponent } from "../package-assigment/package-assigment.component";
import { ReportsComponent } from "../reports/reports.component";

@Component({
  selector: 'app-home-admin',
  standalone: true,
  imports: [FooterComponent, HeaderComponent, JourneyComponent, NgIf, PackageAssigmentComponent, ReportsComponent],
  templateUrl: './home-admin.component.html',
  styleUrl: './home-admin.component.css'
})



export class HomeAdminComponent implements OnInit {
  private timer: any

  constructor(private router: Router) {}
  username: string = 'Administrador';

  showjourney = false;
  showPackage = false
  showReports = false
  showToast = false
  showToastUpdate = false

  ngOnInit(): void {
  this.checkFlag();
  }

  navegationForJourney(){
    this.showjourney = true;
  }
  navegationForPackage(){
    this.showPackage = true
  }
  navigateTo(): void {
    this.showjourney = true;
  }
  navigateToReports(): void {
    this.showReports = true;
  }


  handleElement(){
    console.log("EMIT")
    this.showjourney= false
  }

  handleElementUpdate(){
    console.log("EMIT")
    this.showPackage= false
  }
  checkFlag() {
    const flag = sessionStorage.getItem('bandera');
    this.showToast = flag === 'true';
    this.showToastUpdate = flag === 'false';
    
    
    if (this.showToast) {
      this.timer = setTimeout(() => {
        this.showToast = false;
        sessionStorage.removeItem('bandera');
      }, 5000);
    }
    if (this.showToastUpdate) {
      this.timer = setTimeout(() => {
        this.showToastUpdate = false;
        sessionStorage.removeItem('bandera');
      }, 5000);
    }
  }
}

