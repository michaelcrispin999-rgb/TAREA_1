import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class ReasignarTareaDto {
  @ApiProperty({
    example: 1,
    description: 'Usuario que realiza la reasignación',
  })
  @IsInt()
  idUsuarioAccion: number;

  @ApiProperty({
    example: 3,
    description: 'Nuevo usuario asignado',
  })
  @IsInt()
  idNuevoAsignado: number;
}
