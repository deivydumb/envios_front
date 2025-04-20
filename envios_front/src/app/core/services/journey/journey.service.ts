import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VehicleService } from '../vehicle/vehicle.service';
import { ConveyorService } from '../conveyor/conveyor.service';
import { catchError, switchMap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { ResponseJourney, ResponseJourneyData } from '../../interfaces/journey';
import { IVehicle, ResponseVehicle } from '../../interfaces/vehicle';
import { IConveyor, ReponseConveyor } from '../../interfaces/conveyor';

@Injectable({
  providedIn: 'root'
})
export class JourneyService {
  private apiUrl = 'http://localhost:3000/api/';

  constructor(
    private http: HttpClient,
    private vehicleService: VehicleService,
    private conveyorService: ConveyorService
  ) {}


   getJourneyAll(): Observable<ResponseJourneyData> {

     return this.http.get<ResponseJourneyData>(`${this.apiUrl}journey`).pipe(
       catchError(error => {
         console.error('Error fetching journeys:', error);
         return throwError(() => new Error('Failed to fetch journeys'));
       })
     );
   }
  createCompleteJourney(journeyData: any): Observable<ResponseJourney> {
    return this.createVehicle(journeyData.vehiculo).pipe(
      switchMap(vehicleResponse =>
        this.createConveyor(journeyData.transportista, vehicleResponse.data.id || 0).pipe(
          switchMap(conveyorResponse => {
            const journeyPayload = {
              ...journeyData.envio,
              transportistaId: conveyorResponse.data.id || 0,
              vehicleId: vehicleResponse.data.id || 0
            };
            return this.createJourneyRecord(journeyData,journeyPayload);
          })
        )
      ),
      catchError(error => {
        console.error('Error in journey creation flow:', error);
        return throwError(() => new Error('Complete journey creation failed'));
      })
    );
  }

  private createVehicle(vehicleData: IVehicle): Observable<ResponseVehicle> {
    return this.vehicleService.createdVehicle(vehicleData).pipe(
      catchError(error => {
        console.error('Vehicle creation failed:', error);
        return throwError(() => new Error('Vehicle creation failed'));
      })
    );
  }

  private createConveyor(conveyorData: IConveyor, vehicleId: number): Observable<ReponseConveyor> {
    const conveyorPayload: IConveyor = {
      ...conveyorData,
      vehicleId
    };

    return this.conveyorService.createdConveyor(conveyorPayload).pipe(
      catchError(error => {
        console.error('Conveyor creation failed:', error);
        return throwError(() => new Error('Conveyor creation failed'));
      })
    );
  }

  private createJourneyRecord(journeyData: any, payload: any): Observable<ResponseJourney> {
    console.log("error aca ",journeyData,journeyData.journey )
    const journey = journeyData.journey;

    const mergedPayload = {
      ...journey,
      ...payload
    };
  
    console.log('Merged Journey Payload:', mergedPayload);
  
    return this.http.post<ResponseJourney>(`${this.apiUrl}journey`, mergedPayload).pipe(
      catchError(error => {
        console.error('Journey creation failed:', error);
        return throwError(() => new Error('Journey creation failed'));
      })
    );
  }
  
}
