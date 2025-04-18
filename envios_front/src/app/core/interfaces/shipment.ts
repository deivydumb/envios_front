export enum ShipmentStatus {
    Espera = 'en espera',
    TRANSITO = 'transito',
    EN_REPARTO = 'en_reparto',
    ENTREGADO = 'entregado',
    CANCELADO = 'cancelado'
  }

export interface IShipment {
    id?: number;
    codigo_seguimiento: string;
    fecha_envio?: string;
    fecha_entrega_estimada: string;
    estado: ShipmentStatus;
    costo: number;
    ciudad_origen: string;
    direccion_origen: string;
    ciudad_destino: string;
    direccion_destino: string;
    userId: number;
  }

export interface ResponseShipment {
    data: IShipment;
    status: number;
    message: string;
}