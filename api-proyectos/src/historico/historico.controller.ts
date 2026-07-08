import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HistoricoService } from './historico.service';

@ApiTags('Histórico')
@Controller('historico')
export class HistoricoController {
  constructor(private readonly historicoService: HistoricoService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar todo el historial de cambios',
  })
  findAll() {
    return this.historicoService.findAll();
  }

  @Get('tarea/:id')
  @ApiOperation({
    summary: 'Consultar el historial de una tarea',
  })
  findByTarea(@Param('id') id: string) {
    return this.historicoService.findByTarea(+id);
  }
}