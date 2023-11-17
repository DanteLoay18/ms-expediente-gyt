
export class EliminarExpedienteCommand {
    
    constructor(
                public readonly idExpediente:string,
                public readonly esEstudiante:boolean,
                public readonly dni:string,
                public readonly idUsuario:string
                ) { }
    
}