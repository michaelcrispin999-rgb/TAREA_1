import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { TareasService } from './tareas.service';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';
import { AsignarTareaDto } from './dto/asignar-tarea.dto';
import { ReasignarTareaDto } from './dto/reasignar-tarea.dto';

@ApiTags('Tareas')
@Controller('tareas')
export class TareasController {
  constructor(private readonly tareasService: TareasService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear una nueva tarea',
  })
  create(@Body() createTareaDto: CreateTareaDto) {
    return this.tareasService.create(createTareaDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todas las tareas',
  })
  findAll() {
    return this.tareasService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar una tarea por ID',
  })
  findOne(@Param('id') id: string) {
    return this.tareasService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar una tarea',
  })
  update(
    @Param('id') id: string,
    @Body() updateTareaDto: UpdateTareaDto,
  ) {
    return this.tareasService.update(+id, updateTareaDto);
  }

  @Patch(':id/asignar')
  @ApiOperation({
    summary: 'Asignar una tarea a un usuario',
  })
  asignar(
    @Param('id') id: string,
    @Body() dto: AsignarTareaDto,
  ) {
    return this.tareasService.asignar(+id, dto);
  }

  @Patch(':id/reasignar')
  @ApiOperation({
    summary: 'Reasignar una tarea a otro usuario',
  })
  reasignar(
    @Param('id') id: string,
    @Body() dto: ReasignarTareaDto,
  ) {
    return this.tareasService.reasignar(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar una tarea',
  })
  remove(@Param('id') id: string) {
    return this.tareasService.remove(+id);
  }
}