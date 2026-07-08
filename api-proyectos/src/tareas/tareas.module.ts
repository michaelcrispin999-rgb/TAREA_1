import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TareasController } from './tareas.controller';
import { TareasService } from './tareas.service';

@Module({
  imports: [PrismaModule],
  controllers: [TareasController],
  providers: [TareasService],
})
export class TareasModule {}