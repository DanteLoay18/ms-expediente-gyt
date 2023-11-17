import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ExpedienteUseCase } from "src/core/application/services/expediente.use-case";
import { UpdateExpedienteCommand } from "./update-expediente.command";

@CommandHandler(UpdateExpedienteCommand)
export class UpdateExpedienteHandler implements ICommandHandler<UpdateExpedienteCommand> {

    constructor(private expedienteUseCases: ExpedienteUseCase) { }

    async execute(command: UpdateExpedienteCommand) {
        
        return this.expedienteUseCases.updateExpediente(command.updateExpedienteDto,command.esEstudiante, command.dni,command.usuarioModificacion);
    }

    
}