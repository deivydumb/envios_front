export enum ShipmentStatus {
    PREPARACION = 'preparacion',
    TRANSITO = 'transito',
    EN_REPARTO = 'en_reparto',
    ENTREGADO = 'entregado',
    CANCELADO = 'cancelado'
  }

export interface IShipment {
    id?: number;
    codigo_seguimiento: string;
    fecha_envio?: Date;
    fecha_entrega_estimada: Date;
    estado: ShipmentStatus;
    costo: number;
    ciudad_origen: string;
    direccion_origen: string;
    ciudad_destino: string;
    direccion_destino: string;
    userId: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
  }

export interface ResponseShipment {
    data: IShipment;
    status: number;
    message: string;
}