export interface User {
    id?: number;
    nombre: string;
    identificacion: string;
    document_type: string;
    telefono: string;
    email: string;
    password: string;
    rol?: string; 
    createdAt?: Date;
}

export interface ResponseUser{
    data: User,
    status: number,
    message: string,
}