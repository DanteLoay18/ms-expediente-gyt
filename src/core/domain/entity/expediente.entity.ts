import { Base } from "src/core/shared/domain/base";


export class Expediente extends Base{
    numeroExpediente:string;
    escuela:string;
    facultad:string;
    esValido:boolean;
    estudiantes?: Estudiante[];
    jurados?: Jurado[];
    asesor ?:string;
    fechaSustentacion?:Date;
    
}

export class Estudiante{
    dni: string;
    nombre: string;
}

export class Jurado{
   cargo: string;
   docente:string;
}