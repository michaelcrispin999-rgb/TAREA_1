import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

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
}