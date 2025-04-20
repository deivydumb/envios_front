import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable , throwError,from ,of, forkJoin} from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { IPackage, ResponsePackage, ResponsePackageData } from '../../interfaces/package';
import { mergeMap, toArray, catchError,filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PackageService {
  private apiUrl = 'http://localhost:3000/api/';
  constructor(private http: HttpClient) { }
  

  getPackagesOnHold(): Observable<ResponsePackageData> {
    return this.http.get<ResponsePackageData>(`${this.apiUrl}package/on-hold`).pipe(
      catchError(error => {
        console.error('Error fetching packages on hold:', error);
        return throwError(() => new Error('Error fetching packages on hold'));
      })
    );
  }


  createPackages(packagesData: any[], shipmentId: number): Observable<IPackage[]> {
    if (!packagesData || !packagesData.length) {
      return throwError(() => new Error('La lista de paquetes no puede estar vacía'));
    }

    if (!shipmentId || isNaN(shipmentId)) {
      return throwError(() => new Error('El ID de envío debe ser un número válido'));
    }

    const packagesToCreate = packagesData.map(pkg => ({
      ...pkg,
      shipmentId: shipmentId,
      journeyId: null
    }));

    console.log('Paquetes a crear:', packagesToCreate);

    return from(packagesToCreate).pipe(
      mergeMap(pkg => 
        this.http.post<IPackage>(`${this.apiUrl}package`, pkg).pipe(
          catchError(error => {
            console.error('Error creando paquete:', error);
            return of(null);
          })
        )
      ),
      filter(pkg => pkg !== null),
      toArray(),
      map(packages => packages as IPackage[])
    );
  }
  updateMultiplePackages(packageIds: number[], journeyId: number | null, estadoShipment: string): Observable<ResponsePackage[]> {
    // Convertir cada ID en una llamada individual a putPackage
    const updateObservables = packageIds.map(id => 
      this.putPackage(id, journeyId, estadoShipment)
    );
    
    // Ejecutar todas las actualizaciones en paralelo
    return forkJoin(updateObservables).pipe(
      catchError(error => {
        console.error('Error updating multiple packages:', error);
        return throwError(() => new Error('Error updating some packages'));
      })
    );
    
}
putPackage(id: number, journeyId: number | null, estadoShipment: string): Observable<ResponsePackage> {
  return this.http.get<IPackage>(`${this.apiUrl}package/${id}`).pipe(
    switchMap((currentPackage: any) => {
      const updatedPackage = {
        ...currentPackage,
        journeyId: journeyId
      };

      if (updatedPackage.shipment) {
        updatedPackage.shipment = {
          ...updatedPackage.shipment,
          estado: estadoShipment
        };
      }

      return this.http.put<ResponsePackage>(`${this.apiUrl}package/${id}`, updatedPackage);
    }),
    catchError(error => {
      console.error(`Error updating package ${id}:`, error);
      return throwError(() => new Error(`Error updating package ${id}`));
    })
  );
}
}
/* 
  getPackages() {
    return this.http.get(`${this.apiUrl}packages`);
  }

} */
