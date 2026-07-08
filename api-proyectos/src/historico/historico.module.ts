import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { HistoricoController } from './historico.controller';
import { HistoricoService } from './historico.service';

@Module({
  imports:[PrismaModule],
  controllers:[HistoricoController],
  providers:[HistoricoService]
})
export class HistoricoModule {}