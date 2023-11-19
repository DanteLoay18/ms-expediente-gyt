

export class CreateExpedienteDto{
    tipo:number;
    numeroExpediente:string;
    escuela:string;
    facultad:string;
    tituloProyecto?:string;
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