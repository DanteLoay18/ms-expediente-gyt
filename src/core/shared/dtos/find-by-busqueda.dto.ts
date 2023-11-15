

export interface FindExpedienteByBusquedaDto{
    tipo?:number;
    numeroExpediente?:string;
    escuela?:string;
    facultad?:string;
    page:number;
    pageSize:number;

    idEscuelaUsuario:string;
    esEstudiante:boolean;
    dni:string;

}