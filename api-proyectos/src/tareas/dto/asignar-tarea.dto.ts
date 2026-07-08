import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class AsignarTareaDto {
  @ApiProperty({
    example: 1,
    description: 'Usuario que asigna la tarea',
  })
  @IsInt()
  idUsuarioAsigna!: number;

  @ApiProperty({
    example: 2,
    description: 'Usuario al que se asigna la tarea',
  })
  @IsInt()
  idUsuarioAsignado!: number;
}