import { EXPEDIENTE_REPOSITORY} from './../infraestructure/adapters/adapters.module';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AdaptersModule } from 'src/infraestructure/adapters/adapters.module';
import { PersistenceModule } from 'src/infraestructure/persistence/persistence.module';
import { ExpedienteService } from './domain/services/expediente.service';
import { ExpedienteRepository } from './domain/ports/outbound/expediente.repository';
import { ExpedienteUseCase } from './application/services/expediente.use-case';

const EXPEDIENTE_PROVIDERS=[

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
