import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ExpedienteUseCase } from "src/core/application/services/expediente.use-case";
import { ValidarExpedienteCommand } from "./validar-expediente.command";

@CommandHandler(ValidarExpedienteCommand)
export class ValidarExpedienteHandler implements ICommandHandler<ValidarExpedienteCommand> {

    constructor(private expedienteUseCases: ExpedienteUseCase) { }

    async execute(command: ValidarExpedienteCommand) {
        
        return this.expedienteUseCases.valdiarExpediente(command.idExpediente,command.usuarioModificacion);
    }

    
}