import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ProyectosController } from './proyectos.controller';
import { ProyectosService } from './proyectos.service';

@Module({
  imports: [PrismaModule],
  controllers: [ProyectosController],
  providers: [ProyectosService],
})
export class ProyectosModule {}