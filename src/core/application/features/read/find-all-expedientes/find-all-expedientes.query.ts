
export class FindAllExpedientesQuery {
    
    constructor(
                public readonly page: number,
                public readonly pageSize: number,
                public readonly dni: string,
                public readonly esEstudiante:boolean
                ) { }
    
}