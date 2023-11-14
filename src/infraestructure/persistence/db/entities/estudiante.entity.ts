import { Prop } from "@nestjs/mongoose";

export class Estudiante {

    @Prop({type: String})
    dni: string;
    
    @Prop({type: String})
    nombre: string;

}