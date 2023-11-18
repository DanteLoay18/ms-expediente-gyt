export class ValidarExpedienteCommand {
    
    constructor(
                public readonly idExpediente:string,
                public readonly usuarioModificacion:string
                ) { }
    
}