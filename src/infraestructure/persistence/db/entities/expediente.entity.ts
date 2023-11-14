
import { Prop,Schema, SchemaFactory } from '@nestjs/mongoose';
import { Base } from '../helpers/base';
import { Estudiante } from './estudiante.entity';
import { Jurado } from './jurado.entity';


@Schema()
export class Expediente extends Base{

    @Prop({type: String})
    numeroExpediente:string;

    @Prop({type: String})
    escuela:string;

    @Prop({type: String})
    facultad:string;

    @Prop({type: Boolean})
    esValido:boolean;

    @Prop({type: Array})
    estudiantes?: Estudiante[];

    @Prop({type: Array})
    jurados?: Jurado[];

    @Prop({type: String})
    asesor ?:string;

    @Prop({type: Date})
    fechaSustentacion?:Date;

}

export const ExpedienteSchema= SchemaFactory.createForClass(Expediente);


