export interface IPackage {
    id?: number;
    tipo: string | null;
    descripcion: string | null;
    peso: number;
    largo: number;
    alto: number | null;
    ancho: number | null;
    unidades: number;
    shipmentId: number;
    journeyId?: number | null;
  }

  export interface ResponsePackage {
    data: IPackage,
    status: number,
    message: string,
  }
  export interface ResponsePackageData {
    map(arg0: (p: any) => any): any[];
    data: IPackage[],
    status: number,
    message: string,
  }