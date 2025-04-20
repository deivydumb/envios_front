export interface IVehicle {
    id?: number;
    placa: string;
    marca: string;
    modelo: string;
    capacidad: number;
    createdAt?: Date;
    updatedAt?: Date;
  }


  export interface ResponseVehicle{
      data: IVehicle,
      status: number,
      message: string,
  }