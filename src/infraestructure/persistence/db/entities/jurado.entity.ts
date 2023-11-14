import { Prop } from "@nestjs/mongoose";

export class Jurado {

    @Prop({type: String})
    cargo: string;
    
    @Prop({type: String})
    docente: string;

}