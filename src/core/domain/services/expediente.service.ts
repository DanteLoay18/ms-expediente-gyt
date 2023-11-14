import { Expediente } from "../entity/expediente.entity";
import { ExpedienteRepository } from "../ports/outbound/expediente.repository";

export class ExpedienteService{
    constructor(private readonly expedienteRepository:ExpedienteRepository){}

    findAll(){
        return this.expedienteRepository.findAll();
    }

    findByterm(termino:string, valor:string){
        return this.expedienteRepository.findByTerm(termino, valor);
    }

    findOneById(id:string){
        return this.expedienteRepository.findOneById(id);
    }
    
    createExpediente(expediente:Expediente){
        return this.expedienteRepository.createExpediente(expediente);
    }

    updateExpediente(id:string,expediente:Expediente){
        return this.expedienteRepository.updateExpediente(id,expediente);
    }

    findUltimoExpediente(){
        return this.expedienteRepository.findUltimoExpediente();
    }

    bloquearExpediente(id:string, esBloqueado:boolean){
        return this.expedienteRepository.actualizarBloqueo(id, esBloqueado);
    }

    

}