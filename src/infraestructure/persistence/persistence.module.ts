import { Module } from '@nestjs/common';
import { DatabaseModule } from './db/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Expediente, ExpedienteSchema } from './db/entities/expediente.entity';
@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      {name: Expediente.name, schema: ExpedienteSchema},
    ])
  ],
  exports:[
    DatabaseModule,
    MongooseModule
  ]
})
export class PersistenceModule {}
