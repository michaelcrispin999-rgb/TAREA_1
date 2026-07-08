import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUsuarioDto {
  @ApiProperty({
    example: 'Michael Mamani',
    description: 'Nombre del usuario',
  })
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @ApiProperty({
    example: 'michael@gmail.com',
    description: 'Correo electrónico',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: true,
    description: 'Indica si el usuario está activo',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}