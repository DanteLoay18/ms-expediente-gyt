import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateExpedienteCommand } from "./create-expediente.command";
import { ExpedienteUseCase } from "src/core/application/services/expediente.use-case";

@CommandHandler(CreateExpedienteCommand)
export class CreateExpedienteHandler implements ICommandHandler<CreateExpedienteCommand> {

    constructor(private expedienteUseCases: ExpedienteUseCase) { }

    async execute(command: CreateExpedienteCommand) {
        
        return this.expedienteUseCases.createExpediente(command.createExpedienteDto,command.usuarioCreacion);
    }

    
}