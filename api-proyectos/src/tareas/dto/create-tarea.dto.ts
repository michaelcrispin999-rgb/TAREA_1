import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { EstadoTarea } from '@prisma/client';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export class CreateTareaDto {
  @ApiProperty({
    example: 'Crear m�dulo de Login',
  })
  @IsString()
  @IsNotEmpty()
  descripcion!: string;

  @ApiProperty({
    example: 1,
    description: 'Proyecto al que pertenece la tarea',
  })
  @Type(() => Number)
  @IsInt()
  idProyecto!: number;

  @ApiPropertyOptional({
    example: 1,
    nullable: true,
    description: 'Usuario que asigna inicialmente la tarea. Puede ir en null para una tarea sin asignar.',
  })
  @ValidateIf((o) => o.idUsuarioAsigna !== null && o.idUsuarioAsigna !== undefined)
  @Type(() => Number)
  @IsInt()
  idUsuarioAsigna?: number | null;

  @ApiPropertyOptional({
    example: EstadoTarea.por_asignar,
    enum: EstadoTarea,
    description: 'Estado inicial de la tarea',
  })
  @IsOptional()
  @IsEnum(EstadoTarea)
  estado?: EstadoTarea;

  @ApiPropertyOptional({
    example: 2,
    nullable: true,
    description: 'Usuario asignado a la tarea',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  idUsuarioAsignado?: number | null;
}
