import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { EstadoTarea } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString, ValidateIf } from 'class-validator';

export class UpdateTareaDto {
  @ApiPropertyOptional({
    example: 'Actualizar descripci�n de la tarea',
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({
    enum: EstadoTarea,
    example: EstadoTarea.en_curso,
    description: 'Nuevo estado de la tarea',
  })
  @IsOptional()
  @IsEnum(EstadoTarea)
  estado?: EstadoTarea;

  @ApiPropertyOptional({
    example: 2,
    nullable: true,
    description: 'Usuario asignado a la tarea',
  })
  @ValidateIf((o) => o.idUsuarioAsignado !== null && o.idUsuarioAsignado !== undefined && o.idUsuarioAsignado !== "")
  @Type(() => Number)
  @IsInt()
  idUsuarioAsignado?: number | null;
}
