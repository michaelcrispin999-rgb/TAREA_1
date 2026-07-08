import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HistoricoService{
    constructor(private prisma:PrismaService){}
    async findAll(){
        return await this.prisma.historico.findMany({
            include:{
                tarea:true,
                usuarioAccion:true
            },
            orderBy:{
                fecha:'desc'
            }
        });
    }
    async findByTarea(id:number){
        return await this.prisma.historico.findMany({
            where:{
                idTarea:id
            },
            include:{
                usuarioAccion:true
            },
            orderBy:{
                fecha:'asc'
            }
        });
    }
}