export enum JourneyStatus {
    PENDIENTE = 'pendiente',
    EN_PROGRESO = 'en_progreso',
    COMPLETADO = 'completado',
    CANCELADO = 'cancelado'
  }
  
  export interface IJourney {
    id?: number;
    fecha_inicio: string;
    fecha_fin_estimada: string;
    estado: JourneyStatus;
    origen: string;
    destino: string;
    transportistaId: number;

  }
  
    export interface ResponseJourney{
        data: IJourney,
        status: number,
        message: string,
    }
