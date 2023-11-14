import { Expediente } from "../../entity/expediente.entity";


export interface ExpedienteRepository{
    createExpediente(expediente: Expediente): Promise<Expediente>;
    updateExpediente(idExpediente:string,expediente: Expediente): Promise<Expediente>;
    findAll():Promise<Expediente[]>;
    findOneById(id:string):Promise<Expediente>;
    actualizarBloqueo(id:string,esBloqueado:boolean):Promise<Expediente>;
    findByTerm(termino:string, valor:string):Promise<Expediente[]>;
    findUltimoExpediente():Promise<Expediente>;
}