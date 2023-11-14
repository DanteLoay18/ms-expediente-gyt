import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { MessagePattern } from '@nestjs/microservices';
import { FindByIdQuery } from 'src/core/application/features/read/find-by-id/find-by-id.query';
import { FindAllExpedientesRequest } from '../model/find-all-expedientes.request';
import { FindAllExpedientesQuery } from 'src/core/application/features/read/find-all-expedientes/find-all-expedientes.query';
@Controller()
export class ExpedienteController{

    constructor(
        private command: CommandBus,
        private query: QueryBus
    ) {}
    


    @MessagePattern({cmd: 'findAll_expedientes'})
    async findAllDocentes({page, pageSize, dni,esEstudiante}:FindAllExpedientesRequest) {

        return await this.query.execute(new FindAllExpedientesQuery(page,pageSize,dni,esEstudiante));
        
    }
    
    // @MessagePattern({cmd: 'findByBusqueda_docente'})
    // async findByBusqueda(findByBusquedaRequest:FindByBusquedaRequest) {

    //     return await this.query.execute(new FindByBusquedaQuery(findByBusquedaRequest));
        
    // }

    @MessagePattern({cmd: 'findOne_expediente'})
    async findById(idExpediente:string) {

        return await this.query.execute(new FindByIdQuery(idExpediente));
        
    }
    

    // @MessagePattern({cmd: 'create_docente'})
    // async createDocente({idUsuario, ...createDocenteDto}:CreateDocenteRequest) {

    //     return await this.command.execute(new CreateDocenteCommand(createDocenteDto, idUsuario));
        
    // }

    // @MessagePattern({cmd: 'update_docente'})
    // async updateDocente({idUsuario,idDocente, ...updateDocenteDto}:UpdateDocenteRequest) {

    //     return await this.command.execute(new UpdateDocenteCommand(idDocente,updateDocenteDto, idUsuario));
        
    // }


    // @MessagePattern({cmd: 'modificar_estado_docente'})
    // async modificarEstadoDocente({idUsuario,idDocente, esInactivo}:ModifciarEstadoRequest) {

    //     return await this.command.execute(new ModificarEstadoCommand(idDocente,esInactivo, idUsuario));
        
    // }

    
}