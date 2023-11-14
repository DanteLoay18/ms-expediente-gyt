import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindAllExpedientesQuery } from "./find-all-expedientes.query";
import { ExpedienteUseCase } from "src/core/application/services/expediente.use-case";

@QueryHandler(FindAllExpedientesQuery)
export class FindAllExpedientesHandler implements IQueryHandler<FindAllExpedientesQuery>{

    constructor(private expedienteUseCases: ExpedienteUseCase) { }

    execute(query: FindAllExpedientesQuery) {
        
        return this.expedienteUseCases.getAllExpedientes(query.page, query.pageSize,);
    }

}
