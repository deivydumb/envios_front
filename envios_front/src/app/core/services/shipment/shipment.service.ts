import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IShipment, ShipmentStatus } from '../../interfaces/shipment';

@Injectable({
  providedIn: 'root'
})
export class ShipmentService {
  
  private apiUrl = 'http://localhost:3000/api/';
  
  constructor(private http: HttpClient) { }
  
  getShipments() {
    return this.http.get(`${this.apiUrl}shipments`);
  }

  createShipment(shipmentData: any) {
    const transformedShipment = this.transformToShipment(shipmentData);  
    console.log('Envío transformado:', transformedShipment);  
    return this.http.post(`${this.apiUrl}shipment`, transformedShipment);
  }

  private transformToShipment(data: any): IShipment {
    const userId = this.getUserIdFromToken();
    console.log('ID de usuario obtenido del token:', userId);
    const formatDate = (date: Date): string => {
      return date.toISOString().replace('T', ' ').split('.')[0] + ' -0500';
    };

    return {
      codigo_seguimiento: this.generateTrackingCode(),
      fecha_envio: formatDate(new Date()),
      fecha_entrega_estimada: formatDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)), // 7 días después
      estado: ShipmentStatus.Espera,
      costo: data.costo,
      ciudad_origen: data.ciudad_origen,
      direccion_origen: data.direccion_origen,
      ciudad_destino: data.ciudad_destino,
      direccion_destino: data.direccion_destino,
      userId: userId ? userId : 0
    };
  }

  private generateTrackingCode(): string {
    return `TRACK-${Math.random().toString(36).substring(2, 15)}`;
  }

  private getUserIdFromToken(): number | null {
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('No hay token disponible');
      return null;
    }
  
    const decodedToken = this.decodeJWT(token);
    console.log('Token decodificado:', decodedToken);
    return decodedToken?.id || null;
  }

  private decodeJWT(token: string): any | null {
    try {
      // Verificar que el token tenga el formato correcto
      if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
        console.error('Formato de token inválido');
        return null;
      }
  
      // Obtener el payload (segunda parte del token)
      const base64Url = token.split('.')[1];
      
      // Convertir de Base64Url a Base64 estándar
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      
      // Decodificar el Base64
      const decodedPayload = atob(base64);
      
      // Parsear el JSON
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Error detallado al decodificar el JWT:', {
        error,
        token: token ? `${token.substring(0, 15)}...` : 'null'
      });
      return null;
    }
  }
}