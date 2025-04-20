import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IConveyor, ReponseConveyor } from '../../interfaces/conveyor';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConveyorService {

  
    private apiUrl = 'http://localhost:3000/api/'; // Fixed missing closing quote
      constructor(private http: HttpClient) { }
  
      createdConveyor(conveyor: IConveyor): Observable<ReponseConveyor> {
        console.log('Conveyor data to be sent:', conveyor); 
          return this.http.post<ReponseConveyor>(`${this.apiUrl}conveyor`, conveyor);
      }
}
