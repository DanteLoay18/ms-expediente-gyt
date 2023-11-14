import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PersistenceModule } from '../persistence/persistence.module';
import { MongoExpedienteRepository } from './domain/expediente-mongo.repository';


export const EXPEDIENTE_REPOSITORY = 'EXPEDIENTE_REPOSITORY';

const providers = [
        MongoExpedienteRepository,
        {
            provide: EXPEDIENTE_REPOSITORY,
            useExisting: MongoExpedienteRepository,
        }
]


@Module({
    imports:[
        ConfigModule,
        PersistenceModule,
        
    ],
    providers:[
        ...providers
    ],
    exports:[
        ...providers,
       
    ]
})
export class AdaptersModule {}
