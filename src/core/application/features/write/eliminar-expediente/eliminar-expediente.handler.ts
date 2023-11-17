import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ExpedienteUseCase } from "src/core/application/services/expediente.use-case";
import { EliminarExpedienteCommand } from "./eliminar-expediente.command";

@CommandHandler(EliminarExpedienteCommand)
export class EliminarExpedienteHandler implements ICommandHandler<EliminarExpedienteCommand> {

    constructor(private expedienteUseCases: ExpedienteUseCase) { }

    async execute(command: EliminarExpedienteCommand) {
        
        return this.expedienteUseCases.deleteExpediente(command.idExpediente,command.idUsuario);
    }

    
}