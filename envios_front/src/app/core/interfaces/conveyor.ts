import { IVehicle } from './vehicle';

export interface IConveyor {
    id?: number;
    nombre: string;
    identificacion: string;
    telefono: string;
    email: string;
    empresa: string | null;
    licencia_transporte: string | null;
    vehicleId?: number | null;
  }
  
  export interface ReponseConveyor{
    data: IConveyor,
    status: number,
    message: string,
}