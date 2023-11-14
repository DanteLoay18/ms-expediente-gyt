import { BadRequestException, Injectable  } from "@nestjs/common";
import { Paginated } from "../utils/Paginated";
import { ExpedienteService } from "src/core/domain/services/expediente.service";
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
            expedientes= expedientes.filter((expediente)=>{return expediente.estudiantes.filter((estudiante)=>estudiante.dni===dni)});
          
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

   

    async bloquearDocente(id:string, esBloqueado:boolean){
        try {

            return await this.expedienteService.bloquearExpediente(id, esBloqueado);
        } catch (error) {
            this.handleExceptions(error)
        }
    }
    
    async findOneByTerm(term:string, valor:string, idDocente:string, idFacultad:string){
        // let docentes= await this.expedienteService.findByterm(term, valor);
        // const docentesEncontradoPorFacultad= docentes.find((docente)=>docente.idFacultad===idFacultad && docente._id!==idDocente);
      
        // if(docentesEncontradoPorFacultad)
        // return {
        //         success:false,
        //         message:`El ${term} ${valor} ya esta registrado`
        //     }
       
    }


    private handleExceptions(error:any){
        
        if(error.code==="23505")
        throw new BadRequestException(error.detail)
        
        

        throw new BadRequestException(error.message)
      }

      
}