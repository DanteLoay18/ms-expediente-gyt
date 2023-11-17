
import { UpdateExpedienteDto } from "src/core/shared/dtos/update-expediente.dto";

export class UpdateExpedienteCommand {
    
    constructor(
                public readonly updateExpedienteDto: UpdateExpedienteDto,
                public readonly esEstudiante:boolean,
                public readonly dni:string,
                public readonly usuarioModificacion:string
                ) { }
    
}