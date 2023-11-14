export class CreateExpedienteRequest{
    idUsuario:string;
    numeroExpediente:string;
    tipo:number;
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