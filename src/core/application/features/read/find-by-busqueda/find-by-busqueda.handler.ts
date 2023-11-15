import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ExpedienteUseCase } from "src/core/application/services/expediente.use-case";
import { FindExpedienteByBusquedaQuery } from "./find-by-busqueda.query";

@QueryHandler(FindExpedienteByBusquedaQuery)
export class FindExpedienteByBusquedaHandler implements IQueryHandler<FindExpedienteByBusquedaQuery>{

    constructor(private expedienteUseCases: ExpedienteUseCase) { }

    execute(query: FindExpedienteByBusquedaQuery) {
        
        return this.expedienteUseCases.getExpedientesByBusqueda(query.findExpedienteByBusqueda);
    }

}
