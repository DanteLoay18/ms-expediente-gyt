import { BadRequestException, Injectable  } from "@nestjs/common";
import { Paginated } from "../utils/Paginated";
import { ExpedienteService } from "src/core/domain/services/expediente.service";
import { CreateExpedienteDto } from "src/core/shared/dtos/create-expediente.dto";
import { Expediente } from "src/core/domain/entity/expediente.entity";
@Injectable()
export class ExpedienteUseCase{
    constructor(private readonly expedienteService:ExpedienteService){}

    async getExpedienteById(id:string){
        try{
            const expediente= await this.expedienteService.findOneById(id);

            if(!expediente)
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

   
    async getAllExpedientes(page:number, pageSize:number, dni:string, esEstudiante:boolean){
        try{
            let expedientes= await this.expedienteService.findAll();
            
            if(esEstudiante)
            expedientes= expedientes.filter((expediente)=>{return expediente.estudiantes.some((estudiante)=>estudiante.dni===dni)});

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

    

    // async getDocentesByBusqueda(findByBusquedaDto:FindByBusquedaDto){
    //     try{
    //         let docentes= await this.expedienteService.findAll();

    //         if(findByBusquedaDto.idEscuelaUsuario)
    //         docentes= docentes.filter((docente)=>docente.idEscuela===findByBusquedaDto.idEscuelaUsuario)

    //         docentes= docentes.filter(docente => {
    //             const nombreCoincide = !findByBusquedaDto.nombreCompleto || docente.nombreCompleto.toUpperCase().includes(findByBusquedaDto.nombreCompleto.toUpperCase());
            
    //             const email = !findByBusquedaDto.email || docente.email.toUpperCase().includes(findByBusquedaDto.email.toUpperCase());
              
    //             const escuela = !findByBusquedaDto.idEscuela || docente.idEscuela.toUpperCase().includes(findByBusquedaDto.idEscuela.toUpperCase());
      
    //             const facultad = !findByBusquedaDto.idFacultad || docente.idFacultad === findByBusquedaDto.idFacultad;
            
    //             return nombreCoincide && email && escuela && facultad;
    //           });

    //           return Paginated.create({
    //             page:findByBusquedaDto.page,
    //             pageSize:findByBusquedaDto.pageSize,
    //             items: docentes,
    //             total: docentes.length
    //           })

    //     }catch(error){
    //         this.handleExceptions(error)
    //     }
    // }


    async createExpediente({tipo,escuela, facultad, numeroExpediente, asesor,estudiantes,fechaSustentacion,jurados}:CreateExpedienteDto,esEstudiante:boolean, dni:string, usuarioCreacion:string){
        let expediente= Expediente.CreateExpedienteEstudiante({tipo,escuela, facultad, numeroExpediente, asesor, estudiantes, fechaSustentacion, jurados}, usuarioCreacion);

        if(tipo===1){
            if(!numeroExpediente || !asesor || !jurados || !fechaSustentacion){
                return {
                    success:false,
                    message:"Ingrese todos los datos necesarios del expediente de tipo pilar "
                }
            }

           const expedientesEncontrados= await this.findByTerm("tipo",1, "", facultad);

           const dniEstudiantes= estudiantes.map(({dni})=>dni);

           const estudianteRepetido = expedientesEncontrados.flatMap(({estudiantes})=>estudiantes).filter(({dni})=>dniEstudiantes.includes(dni) );

           if(estudianteRepetido.length>0){
            return {
                success:false,
                message:"Ya se registro un expediente de este tipo para esta facultad con su dni"
            }
           }

        }

        if(tipo===2 || tipo===3){ 
            expediente= Expediente.CreateExpedienteEncargado(tipo,await this.generarNumeroExpediente(), escuela, facultad, estudiantes, usuarioCreacion);

            const expedientesEncontrados= await this.findByTerm("tipo",tipo, "", facultad);

           const dniEstudiantes= estudiantes.map(({dni})=>dni);

           const estudianteRepetido = expedientesEncontrados.flatMap(({estudiantes})=>estudiantes).filter(({dni})=>dniEstudiantes.includes(dni) );

           if(estudianteRepetido.length>0){
            return {
                success:false,
                message:"Ya se registro un expediente de este tipo para esta facultad con su dni"
            }
           }
        }

        if(esEstudiante){
           const estudianteEncontrado= estudiantes.find((estudiante)=>estudiante.dni===dni);

           if(!estudianteEncontrado)
           return {
            success:false,
            message:"No puedes registrar un expediente de otra persona"
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
   

    async bloquearDocente(id:string, esBloqueado:boolean){
        try {

            return await this.expedienteService.bloquearExpediente(id, esBloqueado);
        } catch (error) {
            this.handleExceptions(error)
        }
    }
    
    async findOneByTerm(term:string, valor:string | number, idExpediente:string, idFacultad:string){
        let expedientes= await this.expedienteService.findByterm(term, valor);
        const expedientesEncontradoPorFacultad= expedientes.find((expediente)=>expediente.facultad===idFacultad && expediente._id!==idExpediente);
      
        if(expedientesEncontradoPorFacultad)
        return {
                success:false,
                message:`El ${term} ${valor} ya esta registrado`
            }
       
    }

    async findByTerm(term:string, valor:string | number, idExpediente:string, idFacultad:string){
        let expedientes= await this.expedienteService.findByterm(term, valor);
        const expedientesEncontradoPorFacultad= expedientes.filter((expediente)=>expediente.facultad===idFacultad && expediente._id!==idExpediente);
      
        return expedientesEncontradoPorFacultad;
       
    }

    async generarNumeroExpediente() {
        const expedientes = await this.expedienteService.findUltimoExpediente();

        expedientes.sort((a, b) => {
            return Number(b.numeroExpediente) - Number(a.numeroExpediente);
        });

        const nuevoNumeroExpediente = expedientes[0]
          ? String(Number(expedientes[0].numeroExpediente) + 1)
          : '1';
    
        return nuevoNumeroExpediente;
      }


    private handleExceptions(error:any){
        
        if(error.code==="23505")
        throw new BadRequestException(error.detail)
        
        

        throw new BadRequestException(error.message)
      }

      
}