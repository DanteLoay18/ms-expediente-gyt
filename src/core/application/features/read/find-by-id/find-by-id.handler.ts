import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindByIdQuery } from "./find-by-id.query";
import { ExpedienteUseCase } from "src/core/application/services/expediente.use-case";

@QueryHandler(FindByIdQuery)
export class FindByIdHandler implements IQueryHandler<FindByIdQuery>{

    constructor(private expedienteUseCases: ExpedienteUseCase) { }

    execute(query: FindByIdQuery) {
        
        return this.expedienteUseCases.getExpedienteById(query.idExpediente);
    }

}
