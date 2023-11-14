import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { MessagePattern } from '@nestjs/microservices';
import { FindAllExpedientesRequest } from '../model/find-all-expedientes.request';
import { FindAllExpedientesQuery, FindByIdQuery } from 'src/core/application/features/read';
import { CreateExpedienteRequest } from '../model/create-expediente.request';
import { CreateExpedienteCommand } from 'src/core/application/features/write';
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
    
    // @MessagePattern({cmd: 'findByBusqueda_docente'})
    // async findByBusqueda(findByBusquedaRequest:FindByBusquedaRequest) {

    //     return await this.query.execute(new FindByBusquedaQuery(findByBusquedaRequest));
        
    // }

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


    // @MessagePattern({cmd: 'modificar_estado_docente'})
    // async modificarEstadoDocente({idUsuario,idDocente, esInactivo}:ModifciarEstadoRequest) {

    //     return await this.command.execute(new ModificarEstadoCommand(idDocente,esInactivo, idUsuario));
        
    // }

    
}