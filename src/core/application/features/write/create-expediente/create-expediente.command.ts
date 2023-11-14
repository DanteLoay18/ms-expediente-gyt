import { CreateExpedienteDto } from "src/core/shared/dtos/create-expediente.dto";

export class CreateExpedienteCommand {
    
    constructor(
                public readonly createExpedienteDto: CreateExpedienteDto,
                public readonly usuarioCreacion:string
                ) { }
    
}