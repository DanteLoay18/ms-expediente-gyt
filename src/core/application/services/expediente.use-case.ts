import { BadRequestException, Injectable  } from "@nestjs/common";
import { Paginated } from "../utils/Paginated";
import { ExpedienteService } from "src/core/domain/services/expediente.service";
import { CreateExpedienteDto, Estudiante } from "src/core/shared/dtos/create-expediente.dto";
import { Expediente } from "src/core/domain/entity/expediente.entity";
import { FindExpedienteByBusquedaDto } from "src/core/shared/dtos/find-by-busqueda.dto";
import { UpdateExpedienteDto } from "src/core/shared/dtos/update-expediente.dto";

@Injectable()
export class ExpedienteUseCase{
    constructor(private readonly expedienteService:ExpedienteService){}

    async getExpedienteById(id:string){
        try{
            const expediente= await this.expedienteService.findOneById(id);
     
            if(!expediente || expediente.esEliminado)
                return {
                    success:false,
                    message:"El id del expediente no existe",
                    value:{}
                }
            

            return {
                success: true,
                message: "",
                value:expediente
            };
        }catch(error){
            this.handleExceptions(error)
        }
        
    }

   
    async getAllExpedientes(page:number, pageSize:number, dni:string, esEstudiante:boolean, idFacultad:string){
        try{
            let expedientes= await this.expedienteService.findAll();

            expedientes = expedientes.sort((a, b) => (a.esValido === b.esValido) ? 0 : a.esValido ? 1 : -1);

            if(esEstudiante)
            expedientes= expedientes.filter((expediente)=>{return expediente.estudiantes.some((estudiante)=>estudiante.dni===dni)});

            if(!esEstudiante)
            expedientes= expedientes.filter((expediente)=> expediente.facultad===idFacultad)

            const startIndex = (page - 1 )*pageSize;
            const endIndex = startIndex + pageSize;

            if(expedientes.length === 0 && page !==1){
                const startIndex = (page - 2 )*pageSize;
                const endIndex = startIndex + pageSize;
                return {
                    page:page-1,
                    pageSize:pageSize,
                    items: expedientes.slice(startIndex,endIndex),
                    total: expedientes.length
                }
            }
            return Paginated.create({
                page,
                pageSize,
                items: expedientes.slice(startIndex,endIndex),
                total: expedientes.length
            });       

        }catch(error){
            this.handleExceptions(error)
        }
    }

    

    async getExpedientesByBusqueda({esEstudiante,dni,idFacultadUsuario,...findExpedienteByBusquedaDto}:FindExpedienteByBusquedaDto){
        try{
            let expedientes= await this.expedienteService.findAll();
            
            expedientes = expedientes.sort((a, b) => (a.esValido === b.esValido) ? 0 : a.esValido ? 1 : -1);

            if(esEstudiante)
            expedientes= expedientes.filter((expediente)=>{return expediente.estudiantes.some((estudiante)=>estudiante.dni===dni)});

            if(!esEstudiante)
            expedientes= expedientes.filter((expediente)=> expediente.facultad===idFacultadUsuario);

            expedientes= expedientes.filter(expediente => {
                const tipoConincide = !findExpedienteByBusquedaDto.tipo || expediente.tipo === findExpedienteByBusquedaDto.tipo;
            
                const numeroExpedienteCoincide = !findExpedienteByBusquedaDto.numeroExpediente || expediente.numeroExpediente.toUpperCase().includes(findExpedienteByBusquedaDto.numeroExpediente.toUpperCase());
              
                const escuelaCoincide = !findExpedienteByBusquedaDto.escuela || expediente.escuela.toUpperCase().includes(findExpedienteByBusquedaDto.escuela.toUpperCase());
      
                const facultadCoincide = !findExpedienteByBusquedaDto.facultad || expediente.facultad === findExpedienteByBusquedaDto.facultad;
            
                return tipoConincide && numeroExpedienteCoincide && escuelaCoincide && facultadCoincide;
              });

              return Paginated.create({
                page:findExpedienteByBusquedaDto.page,
                pageSize:findExpedienteByBusquedaDto.pageSize,
                items: expedientes,
                total: expedientes.length
              })

        }catch(error){
            this.handleExceptions(error)
        }
    }


    async createExpediente({tipo,escuela, facultad, numeroExpediente,tituloProyecto, asesor,estudiantes,fechaSustentacion,jurados}:CreateExpedienteDto,esEstudiante:boolean, dni:string, usuarioCreacion:string){
        let expediente= Expediente.CreateExpedienteEstudiante({tipo,escuela, facultad, numeroExpediente, tituloProyecto, asesor, estudiantes, fechaSustentacion, jurados}, usuarioCreacion);
        
        if(esEstudiante){
            const estudianteEncontrado= estudiantes.find((estudiante)=>estudiante.dni===dni);
 
            if(!estudianteEncontrado)
            return {
             success:false,
             message:"No puedes registrar un expediente de otra persona"
             }
         }

        if(tipo===1){
            if(!numeroExpediente || !asesor || !jurados || !fechaSustentacion){
                return {
                    success:false,
                    message:"Ingrese todos los datos necesarios del expediente de tipo pilar "
                }
            }

           const expedientesEncontrados= await this.findByTerm("tipo",1, "", escuela);

           const dniEstudiantes= estudiantes.map(({dni})=>dni);

           const estudianteRepetido = expedientesEncontrados.flatMap(({estudiantes})=>estudiantes).filter(({dni})=>dniEstudiantes.includes(dni) );

           if(estudianteRepetido.length>0){
            return {
                success:false,
                message:"Ya se registro un expediente de este tipo para esta escuela con su dni"
            }
           }

           const expedienteEncontradoByNumeroExpediente= await this.findOneByTerm("numeroExpediente", numeroExpediente, "");

           if(expedienteEncontradoByNumeroExpediente){
            return {
                success:false,
                message:"Este numero de expediente ya existe"
            }
           }
        }

        if(tipo===2 || tipo===3){ 
            expediente= Expediente.CreateExpedienteEncargado(tipo,await this.generarNumeroExpediente(), escuela, facultad, estudiantes, usuarioCreacion);

            const expedientesEncontrados= await this.findByTerm("tipo",tipo, "", escuela);

           const dniEstudiantes= estudiantes.map(({dni})=>dni);

           const estudianteRepetido = expedientesEncontrados.flatMap(({estudiantes})=>estudiantes).filter(({dni})=>dniEstudiantes.includes(dni) );

           if(estudianteRepetido.length>0){
            return {
                success:false,
                message:"Ya se registro un expediente de este tipo para esta escuela con su dni"
            }
           }
        }

        
        
        
        const expedienteCreado = await this.expedienteService.createExpediente(expediente);

        if(!expedienteCreado)
                return {
                    success:false,
                    message:"El expediente no se pudo registrar correctamente"
                }

        return {
            success:true,
            message:"El expediente se creo correctamente"
        }
    }

    async updateExpediente({idExpediente,tipo,escuela, facultad, numeroExpediente, tituloProyecto, asesor,estudiantes,fechaSustentacion,jurados }:UpdateExpedienteDto,esEstudiante:boolean, dni:string, usuarioModficiacion:string ){
        const {success, message, value}= await this.getExpedienteById(idExpediente);

        if(!success){
            return {
                success,
                message
            }
        }

        if(value?.['esValido']){
            return {
                success: false,
                message: "No puede eliminar un expediente que fue validado"
            }
        }

        if(esEstudiante){
            const estudianteEncontrado= value?.['estudiantes'].find((estudiante:Estudiante)=>estudiante.dni===dni);
 
            if(!estudianteEncontrado)
            return {
             success:false,
             message:"No puedes eliminar el expediente de otro estudiante"
             }
         }

         let expediente= Expediente.CreateExpedienteEstudiante({tipo,escuela, facultad,tituloProyecto, numeroExpediente, asesor, estudiantes, fechaSustentacion, jurados}, usuarioModficiacion);

            if(tipo===1){
                if(!numeroExpediente || !asesor || !jurados || !fechaSustentacion || !tituloProyecto){
                    return {
                        success:false,
                        message:"Ingrese todos los datos necesarios del expediente de tipo pilar "
                    }
                }
    
               const expedientesEncontrados= await this.findByTerm("tipo",1, idExpediente, escuela);
    
               const dniEstudiantes= estudiantes.map(({dni})=>dni);
    
               const estudianteRepetido = expedientesEncontrados.flatMap(({estudiantes})=>estudiantes).filter(({dni})=>dniEstudiantes.includes(dni) );
    
               if(estudianteRepetido.length>0){
                return {
                    success:false,
                    message:"Ya se registro un expediente de este tipo para esta escuela con su dni"
                }
               }
    
               const expedienteEncontradoByNumeroExpediente= await this.findOneByTerm("numeroExpediente", numeroExpediente, idExpediente);
    
               if(expedienteEncontradoByNumeroExpediente){
                return {
                    success:false,
                    message:"Este numero de expediente ya existe"
                }
               }
            }
    
            if(tipo===2 || tipo===3){ 
                expediente= Expediente.UpdateExpedienteEncargado(tipo,escuela, facultad, estudiantes, usuarioModficiacion);
    
                const expedientesEncontrados= await this.findByTerm("tipo",tipo, idExpediente, escuela);
    
               const dniEstudiantes= estudiantes.map(({dni})=>dni);
    
               const estudianteRepetido = expedientesEncontrados.flatMap(({estudiantes})=>estudiantes).filter(({dni})=>dniEstudiantes.includes(dni) );
    
               if(estudianteRepetido.length>0){
                return {
                    success:false,
                    message:"Ya se registro un expediente de este tipo para esta escuela con su dni"
                }
               }
            }

           
            const expedienteActualizado = await this.expedienteService.updateExpediente(idExpediente,expediente);

            if(!expedienteActualizado)
                    return {
                        success:false,
                        message:"El expediente no se pudo registrar correctamente"
                    }
    
            return {
                success:true,
                message:"El expediente se creo correctamente"
            }
            



    }

    async valdiarExpediente(idExpediente:string, idUsuario:string){
        const {success, message, value}= await this.getExpedienteById(idExpediente);

        if(!success){
            return {
                success,
                message
            }
        }

        if(value?.['esValido']){
            return {
                success: false,
                message: "El expediente ya es valido"
            }
        }

        const expediente = Expediente.ValidarExpediente(idUsuario);

        const expedienteValidado = await this.expedienteService.updateExpediente(idExpediente, expediente);

        if(!expedienteValidado){
            return {
                success:false,
                message:"Hubo un error al validar el expediente"
            }
        }

        return {
            success:true,
            message:"El expediente se valido correctamente"
        }

    }
   
    async deleteExpediente(idExpediente:string,esEstudiante:boolean, dni:string, idUsuario:string){
        const {success, message, value}= await this.getExpedienteById(idExpediente);

        if(!success){
            return {
                success,
                message
            }
        }

        if(value?.['esValido']){
            return {
                success: false,
                message: "No puede eliminar un expediente que fue validado"
            }
        }

        if(esEstudiante){
            const estudianteEncontrado= value?.['estudiantes'].find((estudiante:Estudiante)=>estudiante.dni===dni);
 
            if(!estudianteEncontrado)
            return {
             success:false,
             message:"No puedes eliminar el expediente de otro estudiante"
             }
         }

        const expediente = Expediente.EliminarExpediente(idUsuario);

        const expedienteEliminado = await this.expedienteService.updateExpediente(idExpediente, expediente);

        if(!expedienteEliminado){
            return {
                success:false,
                message:"Hubo un error al eliminar el expediente"
            }
        }

        return {
            success:true,
            message:"El expediente se elimino correctamente"
        }

    }

    async bloquearDocente(id:string, esBloqueado:boolean){
        try {

            return await this.expedienteService.bloquearExpediente(id, esBloqueado);
        } catch (error) {
            this.handleExceptions(error)
        }
    }
    
    async findOneByTerm(term:string, valor:string | number, idExpediente:string,){
        let expedientes= await this.expedienteService.findByterm(term, valor);
        const expedienteEncontrado= expedientes.find((expediente)=> expediente._id!==idExpediente);
      
        return expedienteEncontrado;
       
    }

    async findByTerm(term:string, valor:string | number, idExpediente:string, idEscuela:string){
        let expedientes= await this.expedienteService.findByterm(term, valor);
        const expedientesEncontradoPorFacultad= expedientes.filter((expediente)=>expediente.escuela===idEscuela && expediente._id!==idExpediente);
      
        return expedientesEncontradoPorFacultad;
       
    }

    async generarNumeroExpediente() {
        const expedientes = await this.expedienteService.findUltimoExpediente();
        
        expedientes.sort((a, b) => {
            const numeroA = Number(a.numeroExpediente.match(/\d+$/)[0]);
            const numeroB = Number(b.numeroExpediente.match(/\d+$/)[0]);

            return numeroB - numeroA;

        });

        const nuevoNumeroExpediente =
                        expedientes[0] ? Number(expedientes[0].numeroExpediente.match(/\d+$/)[0]) + 1 : 1;

        // Obtener el año actual
        const year = new Date().getFullYear();

        // Formatear el número de expediente con ceros a la izquierda
        const numeroFormateado = String(nuevoNumeroExpediente).padStart(3, '0');

        // Construir el número de expediente con el formato deseado
        const expedienteFormato = `SGYT-${year}-${numeroFormateado}`;

        return expedienteFormato;
      }


    private handleExceptions(error:any){
        
        if(error.code==="23505")
        throw new BadRequestException(error.detail)
        
        

        throw new BadRequestException(error.message)
      }

      
}