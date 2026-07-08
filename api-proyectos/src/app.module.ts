import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ProyectosModule } from './proyectos/proyectos.module';
import { TareasModule } from './tareas/tareas.module';
import { HistoricoModule } from './historico/historico.module';

@Module({
  imports: [
    PrismaModule,
    UsuariosModule,
    ProyectosModule,
    TareasModule,
    HistoricoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}