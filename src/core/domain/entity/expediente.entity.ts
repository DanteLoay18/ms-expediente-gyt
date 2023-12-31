import { Base } from "src/core/shared/domain/base";
import { CreateExpedienteDto } from "src/core/shared/dtos/create-expediente.dto";


export class Expediente extends Base{
    numeroExpediente:string;
    tipo:number;
    escuela:string;
    facultad:string;
    esValido:boolean;
    tituloProyecto?:string;
    estudiantes?: Estudiante[];
    jurados?: Jurado[];
    asesor ?:string;
    fechaSustentacion?:Date;


    static CreateExpedienteEstudiante({tipo, numeroExpediente, escuela,tituloProyecto, facultad,estudiantes,jurados,asesor,fechaSustentacion}:CreateExpedienteDto, usuarioCreacion:string){
        const expediente= new Expediente();
        expediente.tipo=tipo;
        expediente.numeroExpediente=numeroExpediente;      
        expediente.escuela=escuela;
        expediente.facultad=facultad;
        expediente.tituloProyecto=tituloProyecto;
        expediente.estudiantes=estudiantes;
        expediente.jurados=jurados;
        expediente.asesor=asesor;
        expediente.fechaSustentacion=fechaSustentacion;
        expediente.fechaCreacion= new Date();
        expediente.usuarioCreacion=usuarioCreacion;
        expediente.esValido=false;
        expediente.esEliminado=false;
        expediente.esBloqueado=false;
        return expediente;
    }

    static CreateExpedienteEncargado(tipo:number,numeroExpediente:string, escuela:string, facultad:string, estudiantes:Estudiante[], usuarioCreacion:string){
        const expediente= new Expediente();
        expediente.tipo=tipo;
        expediente.numeroExpediente=numeroExpediente;
        expediente.escuela=escuela;
        expediente.facultad=facultad;
        expediente.estudiantes=estudiantes;
        expediente.fechaCreacion= new Date();
        expediente.usuarioCreacion=usuarioCreacion;
        expediente.esValido=false;
        expediente.esEliminado=false;
        expediente.esBloqueado=false;
        return expediente;
    }

    static UpdateExpedienteEstudiante({tipo, numeroExpediente,tituloProyecto, escuela, facultad,estudiantes,jurados,asesor,fechaSustentacion}:CreateExpedienteDto, usuarioModificacion:string){
        const expediente= new Expediente();
        expediente.tipo=tipo;
        expediente.numeroExpediente=numeroExpediente;      
        expediente.escuela=escuela;
        expediente.facultad=facultad;
        expediente.estudiantes=estudiantes;
        expediente.tituloProyecto=tituloProyecto;
        expediente.jurados=jurados;
        expediente.asesor=asesor;
        expediente.fechaSustentacion=fechaSustentacion;
        expediente.fechaModificacion=new Date();
        expediente.usuarioModificacion=usuarioModificacion;
        return expediente;
    }

    static UpdateExpedienteEncargado(tipo:number, escuela:string, facultad:string, estudiantes:Estudiante[], usuarioModificacion:string){
        const expediente= new Expediente();
        expediente.tipo=tipo;
        expediente.escuela=escuela;
        expediente.facultad=facultad;
        expediente.estudiantes=estudiantes;
        expediente.fechaModificacion=new Date();
        expediente.usuarioModificacion=usuarioModificacion;
        return expediente;
    }

    static ValidarExpediente(usuarioModificacion:string){
        const expediente= new Expediente();

        expediente.esValido=true;
        expediente.fechaModificacion=new Date();
        expediente.usuarioModificacion=usuarioModificacion;
        return expediente;
    }

    static EliminarExpediente(usuarioModificacion:string){
        const expediente= new Expediente();

        expediente.esEliminado=true;
        expediente.fechaModificacion=new Date();
        expediente.usuarioModificacion=usuarioModificacion;
        return expediente;
    }
    
}

export class Estudiante{
    dni: string;
    nombre: string;
}

export class Jurado{
   cargo: string;
   docente:string;
}