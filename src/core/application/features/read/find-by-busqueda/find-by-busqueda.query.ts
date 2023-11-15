import { FindExpedienteByBusquedaDto } from '../../../../shared/dtos/find-by-busqueda.dto';

export class FindExpedienteByBusquedaQuery {
    
    constructor(
                public readonly findExpedienteByBusqueda:FindExpedienteByBusquedaDto
                ) { }
    
}