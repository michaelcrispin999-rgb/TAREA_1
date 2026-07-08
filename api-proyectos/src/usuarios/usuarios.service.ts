import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {

  constructor(private prisma: PrismaService) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    return await this.prisma.usuario.create({
      data: createUsuarioDto,
    });
  }

  async findAll() {
    return await this.prisma.usuario.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.usuario.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return await this.prisma.usuario.update({
      where: {
        id,
      },
      data: updateUsuarioDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.usuario.delete({
      where: {
        id,
      },
    });
  }

}