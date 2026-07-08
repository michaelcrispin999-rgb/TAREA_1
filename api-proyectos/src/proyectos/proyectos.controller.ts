import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { ProyectosService } from './proyectos.service';

@ApiTags('Proyectos')
@Controller('proyectos')
export class ProyectosController {
  constructor(private readonly proyectosService: ProyectosService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo proyecto',
  })
  create(@Body() dto: CreateProyectoDto) {
    return this.proyectosService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todos los proyectos',
  })
  findAll() {
    return this.proyectosService.findAll();
  }

  @Get(':id/taller')
  @ApiOperation({
    summary: 'Mostrar un proyecto con sus tareas y su historial',
  })
  taller(@Param('id', ParseIntPipe) id: number) {
    return this.proyectosService.taller(id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar un proyecto por ID',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.proyectosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un proyecto',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProyectoDto,
  ) {
    return this.proyectosService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un proyecto',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.proyectosService.remove(id);
  }
}