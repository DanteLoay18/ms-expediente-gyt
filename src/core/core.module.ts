import { EXPEDIENTE_REPOSITORY} from './../infraestructure/adapters/adapters.module';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AdaptersModule } from 'src/infraestructure/adapters/adapters.module';
import { PersistenceModule } from 'src/infraestructure/persistence/persistence.module';
import { ExpedienteService } from './domain/services/expediente.service';
import { ExpedienteRepository } from './domain/ports/outbound/expediente.repository';
import { ExpedienteUseCase } from './application/services/expediente.use-case';
import { FindAllExpedientesQuery } from './application/features/read/find-all-expedientes/find-all-expedientes.query';
import { FindAllExpedientesHandler } from './application/features/read/find-all-expedientes/find-all-expedientes.handler';
import { FindByIdHandler } from './application/features/read/find-by-id/find-by-id.handler';
import { FindByIdQuery } from './application/features/read/find-by-id/find-by-id.query';

const EXPEDIENTE_PROVIDERS=[
    FindAllExpedientesQuery,
    FindAllExpedientesHandler,
    FindByIdQuery,
    FindByIdHandler,
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
