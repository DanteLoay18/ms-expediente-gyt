import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { MessagePattern } from '@nestjs/microservices';
import { FindAllExpedientesRequest } from '../model/find-all-expedientes.request';
import { FindAllExpedientesQuery, FindByIdQuery, FindExpedienteByBusquedaQuery } from 'src/core/application/features/read';
import { CreateExpedienteRequest } from '../model/create-expediente.request';
import { CreateExpedienteCommand, EliminarExpedienteCommand } from 'src/core/application/features/write';
import { FindByBusquedaExpedienteRequest } from '../model/find-by-busqueda-expediente.request';
import { EliminarExpedienteRequest } from '../model/eliminar-expediente.request';
@Controller()
export class ExpedienteController{

    constructor(
        private command: CommandBus,
        private query: QueryBus
    ) {}
    


    @MessagePattern({cmd: 'findAll_expedientes'})
    async findAllDocentes({page, pageSize, dni,esEstudiante, idEscuela}:FindAllExpedientesRequest) {

        return await this.query.execute(new FindAllExpedientesQuery(page,pageSize,dni,esEstudiante,idEscuela));
        
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
    async createDocente({idUsuario,esEstudiante,dni, ...createExpedienteDto}:CreateExpedienteRequest) {

        return await this.command.execute(new CreateExpedienteCommand(createExpedienteDto,esEstudiante,dni, idUsuario));
        
    }

    // @MessagePattern({cmd: 'update_docente'})
    // async updateDocente({idUsuario,idDocente, ...updateDocenteDto}:UpdateDocenteRequest) {

    //     return await this.command.execute(new UpdateDocenteCommand(idDocente,updateDocenteDto, idUsuario));
        
    // }


    @MessagePattern({cmd: 'eliminar_expediente'})
    async modificarEstadoDocente({idUsuario,idExpediente}:EliminarExpedienteRequest) {

        return await this.command.execute(new EliminarExpedienteCommand(idExpediente,idUsuario));
        
    }

    
}