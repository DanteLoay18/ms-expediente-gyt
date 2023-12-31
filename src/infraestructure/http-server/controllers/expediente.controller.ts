import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { MessagePattern } from '@nestjs/microservices';
import { FindAllExpedientesRequest } from '../model/find-all-expedientes.request';
import { FindAllExpedientesQuery, FindByIdQuery, FindExpedienteByBusquedaQuery } from 'src/core/application/features/read';
import { CreateExpedienteRequest } from '../model/create-expediente.request';
import { CreateExpedienteCommand, EliminarExpedienteCommand, UpdateExpedienteCommand, ValidarExpedienteCommand } from 'src/core/application/features/write';
import { FindByBusquedaExpedienteRequest } from '../model/find-by-busqueda-expediente.request';
import { EliminarExpedienteRequest } from '../model/eliminar-expediente.request';
import { UpdateExpedienteRequest } from '../model/update-expediente.request';
import { ValidarExpedienteRequest } from '../model/validar-expediente.request';
@Controller()
export class ExpedienteController{

    constructor(
        private command: CommandBus,
        private query: QueryBus
    ) {}
    


    @MessagePattern({cmd: 'findAll_expedientes'})
    async findAllDocentes({page, pageSize, dni,esEstudiante, idFacultad}:FindAllExpedientesRequest) {

        return await this.query.execute(new FindAllExpedientesQuery(page,pageSize,dni,esEstudiante,idFacultad));
        
    }
    
    @MessagePattern({cmd: 'findByBusqueda_expediente'})
    async findByBusqueda(findByBusquedaExpedienteRequest:FindByBusquedaExpedienteRequest) {

        return await this.query.execute(new FindExpedienteByBusquedaQuery(findByBusquedaExpedienteRequest));
        
    }

    @MessagePattern({cmd: 'findOne_expediente'})
    async findById(idExpediente:string) {

        return await this.query.execute(new FindByIdQuery(idExpediente));
        
    }
    

    @MessagePattern({cmd: 'create_expediente'})
    async createExpediente({idUsuario,esEstudiante,dni, ...createExpedienteDto}:CreateExpedienteRequest) {
        console.log(createExpedienteDto)
        return await this.command.execute(new CreateExpedienteCommand(createExpedienteDto,esEstudiante,dni, idUsuario));
        
    }

    @MessagePattern({cmd: 'update_expediente'})
    async updateExpediente({idUsuario,dni,esEstudiante, ...updateExpdienteDto}:UpdateExpedienteRequest) {

        return await this.command.execute(new UpdateExpedienteCommand(updateExpdienteDto,esEstudiante, dni, idUsuario));
        
    }

    @MessagePattern({cmd: 'validar_expediente'})
    async validarExpediente({idUsuario,idExpediente}:ValidarExpedienteRequest) {

        return await this.command.execute(new ValidarExpedienteCommand(idExpediente, idUsuario));
        
    }

    @MessagePattern({cmd: 'eliminar_expediente'})
    async modificarEstadoDocente({idUsuario,esEstudiante, dni,idExpediente}:EliminarExpedienteRequest) {

        return await this.command.execute(new EliminarExpedienteCommand(idExpediente,esEstudiante,dni,idUsuario));
        
    }

    
}