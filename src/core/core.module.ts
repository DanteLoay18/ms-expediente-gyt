import { EXPEDIENTE_REPOSITORY} from './../infraestructure/adapters/adapters.module';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AdaptersModule } from 'src/infraestructure/adapters/adapters.module';
import { PersistenceModule } from 'src/infraestructure/persistence/persistence.module';
import { ExpedienteService } from './domain/services/expediente.service';
import { ExpedienteRepository } from './domain/ports/outbound/expediente.repository';
import { ExpedienteUseCase } from './application/services/expediente.use-case';
import { FindAllExpedientesHandler, FindAllExpedientesQuery, FindByIdHandler, FindByIdQuery, FindExpedienteByBusquedaHandler, FindExpedienteByBusquedaQuery } from './application/features/read';
import { CreateExpedienteCommand, CreateExpedienteHandler, EliminarExpedienteCommand, EliminarExpedienteHandler } from './application/features/write';


const EXPEDIENTE_PROVIDERS=[
    FindAllExpedientesQuery,
    FindAllExpedientesHandler,
    FindByIdQuery,
    FindByIdHandler,
    FindExpedienteByBusquedaQuery,
    FindExpedienteByBusquedaHandler,
    CreateExpedienteCommand,
    CreateExpedienteHandler,
    EliminarExpedienteCommand,
    EliminarExpedienteHandler
]

const providers = [
    ...EXPEDIENTE_PROVIDERS,
]



@Module({
    imports:[
        PersistenceModule,
        AdaptersModule,
        CqrsModule
    ],
    providers:[
        ...providers,
       {
            provide:ExpedienteService,
            useFactory:(
                expedienteRepository:ExpedienteRepository
            )=> new ExpedienteService(expedienteRepository),
            inject:[
                EXPEDIENTE_REPOSITORY
            ]
        },
        {
            provide: ExpedienteUseCase,
            useFactory: (expedienteService: ExpedienteService,) => new ExpedienteUseCase(expedienteService),
            inject: [
                ExpedienteService
            ] 
        },
        
    ],
    exports:[
        ...providers,
        CqrsModule,
        AdaptersModule
    ]
})
export class CoreModule {}
