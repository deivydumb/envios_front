import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable , throwError,from ,of} from 'rxjs';
import { map } from 'rxjs/operators';
import { IPackage } from '../../interfaces/package';
import { mergeMap, toArray, catchError,filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PackageService {
  private apiUrl = 'http://localhost:3000/api/';
  constructor(private http: HttpClient) { }
  
  createPackages(packagesData: any[], shipmentId: number): Observable<IPackage[]> {
    // Validación básica
    if (!packagesData || !packagesData.length) {
      return throwError(() => new Error('La lista de paquetes no puede estar vacía'));
    }

    if (!shipmentId || isNaN(shipmentId)) {
      return throwError(() => new Error('El ID de envío debe ser un número válido'));
    }

    // Preparar los paquetes con el shipmentId
    const packagesToCreate = packagesData.map(pkg => ({
      ...pkg,
      shipmentId: shipmentId,
      journeyId: null
    }));

    console.log('Paquetes a crear:', packagesToCreate);

    // Convertir el array a un Observable y procesar cada paquete
    return from(packagesToCreate).pipe(
      // mergeMap para enviar cada paquete individualmente
      mergeMap(pkg => 
        this.http.post<IPackage>(`${this.apiUrl}package`, pkg).pipe(
          catchError(error => {
            console.error('Error creando paquete:', error);
            // Devuelve un observable vacío para continuar con los demás
            return of(null);
          })
        )
      ),
      // Filtrar posibles nulos de paquetes fallidos
      filter(pkg => pkg !== null),
      // Convertir todas las respuestas en un array
      toArray(),
      // Tipar la respuesta final
      map(packages => packages as IPackage[])
    );
  }
}
/* 
  getPackages() {
    return this.http.get(`${this.apiUrl}packages`);
  }

} */
