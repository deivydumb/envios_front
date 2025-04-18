import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShipmentService {
  
  private apiUrl = 'http://localhost:3000/api/'; // Fixed missing closing quote
  constructor(private http: HttpClient) { }


  getShipments() {
    return this.http.get(`${this.apiUrl}shipments`);
  }


  createShipment(shipmentData: any) {
    console.log("Creando envío", shipmentData);
    return "true";
  }


}
