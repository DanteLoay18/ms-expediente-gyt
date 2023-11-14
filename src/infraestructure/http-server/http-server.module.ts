import { Module } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { ExpedienteController } from './controllers/expediente.controller';

@Module({
    imports:[CoreModule],
    controllers:[
        ExpedienteController
    ]
})
export class HttpServerModule {}
