import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IVehicle, ResponseVehicle } from '../../interfaces/vehicle';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  
    private apiUrl = 'http://localhost:3000/api/'; // Fixed missing closing quote
      constructor(private http: HttpClient) { }

      createdVehicle(vehicleData: IVehicle): Observable<ResponseVehicle> {
        return this.http.post<ResponseVehicle>(`${this.apiUrl}vehicle`, vehicleData);
      }
  
}
