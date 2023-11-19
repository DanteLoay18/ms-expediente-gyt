export class CreateExpedienteRequest{
    idUsuario:string;
    esEstudiante:boolean;
    dni:string;
    numeroExpediente:string;
    tipo:number;
    escuela:string;
    facultad:string;
    esValido:boolean;
    tituloProyecto:string;
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