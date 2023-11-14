import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ExpedienteRepository } from "src/core/domain/ports/outbound/expediente.repository";
import { Expediente } from "src/infraestructure/persistence/db/entities/expediente.entity";


@Injectable()
export class MongoExpedienteRepository implements ExpedienteRepository {
    
    constructor(@InjectModel(Expediente.name) private expedienteRepository: Model<Expediente>) { }
    
    findAll(): Promise<Expediente[]> {
        return this.expedienteRepository.find();
    }

    findByTerm(termino:string, valor:string):Promise<Expediente[]>{
        return this.expedienteRepository.find({[termino]:valor})
    }

    createExpediente(Expediente: Expediente){
        return this.expedienteRepository.create(Expediente);
    }

    updateExpediente(idExpediente:string,Expediente: Expediente){
        return this.expedienteRepository.findByIdAndUpdate(idExpediente,Expediente, {new:true})
    }
    
    findOneById(id:string){
        return this.expedienteRepository.findById(id);
    }
   
    
    actualizarBloqueo(id:string,esBloqueado:boolean){
        return this.expedienteRepository.findByIdAndUpdate(id, {
            esBloqueado  
            }, {new:true})
    }

    findUltimoExpediente(){
        return this.expedienteRepository.findOne({
            order: { numeroExpediente: 'DESC' },
          });
    }
   
    
   
}