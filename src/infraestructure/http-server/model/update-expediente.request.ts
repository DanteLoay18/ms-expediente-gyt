import { PartialType } from '@nestjs/swagger';
import { CreateExpedienteRequest } from './create-expediente.request';


export class UpdateExpedienteRequest extends PartialType(CreateExpedienteRequest){
    idExpediente:string;
}