import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EstadoTarea,AccionHistorico } from '@prisma/client';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';
import { AsignarTareaDto } from './dto/asignar-tarea.dto';
import { ReasignarTareaDto } from './dto/reasignar-tarea.dto';

@Injectable()
export class TareasService {
  constructor(private prisma: PrismaService) {}

  private normalizarTarea(tarea: any | null) {
    if (!tarea) {
      return tarea;
    }

    return {
      ...tarea,
      asignado: tarea.asignado ?? null,
    };
  }

  async create(createTareaDto: CreateTareaDto) {

  // Verificar proyecto
  const proyecto = await this.prisma.proyecto.findUnique({
    where: {
      id: createTareaDto.idProyecto,
    },
  });

  if (!proyecto) {
    throw new NotFoundException('El proyecto no existe');
  }

  const rawIdUsuarioAsigna = createTareaDto.idUsuarioAsigna;
  const idUsuarioAsigna: number | undefined =
    rawIdUsuarioAsigna === null || rawIdUsuarioAsigna === undefined
      ? undefined
      : typeof rawIdUsuarioAsigna === 'string'
        ? ['Sin_asignar', 'sin_asignar', 'Sin asignar', ''].includes(rawIdUsuarioAsigna)
          ? undefined
          : Number(rawIdUsuarioAsigna)
        : rawIdUsuarioAsigna;

  if (idUsuarioAsigna !== undefined) {
    const usuario = await this.prisma.usuario.findUnique({
      where: {
        id: idUsuarioAsigna,
      },
    });

    if (!usuario) {
      throw new NotFoundException('El usuario no existe');
    }
  }

  const rawIdUsuarioAsignado = createTareaDto.idUsuarioAsignado;
  const idUsuarioAsignado: number | undefined =
    rawIdUsuarioAsignado === null || rawIdUsuarioAsignado === undefined
      ? undefined
      : typeof rawIdUsuarioAsignado === 'string'
        ? rawIdUsuarioAsignado === ''
          ? undefined
          : Number(rawIdUsuarioAsignado)
        : rawIdUsuarioAsignado;

  if (idUsuarioAsignado !== undefined) {
    const usuarioAsignado = await this.prisma.usuario.findUnique({
      where: {
        id: idUsuarioAsignado,
      },
    });

    if (!usuarioAsignado) {
      throw new NotFoundException('El usuario asignado no existe');
    }
  }

  const data: any = {
    descripcion: createTareaDto.descripcion,
    idProyecto: createTareaDto.idProyecto,
    idUsuarioAsignado: idUsuarioAsignado ?? null,
    estado: createTareaDto.estado ?? EstadoTarea.por_asignar,
  };

  if (idUsuarioAsigna !== undefined) {
    data.idUsuarioAsigna = idUsuarioAsigna;
  }

  const tareaCreada = await this.prisma.tarea.create({
    include: {
      asignado: true,
    },
    data,
  });

  return this.normalizarTarea(tareaCreada);

}
  async findAll() {
    const tareas = await this.prisma.tarea.findMany({
      include: {
        proyecto: true,
        asigna: true,
        asignado: true,
        historicos:{
          include:{
            usuarioAccion:true,
          },
          orderBy: {
            fecha: 'asc',
          }
        }
      },
    });

    return tareas.map((tarea) => this.normalizarTarea(tarea));
  }

  async findOne(id: number) {
    const tarea = await this.prisma.tarea.findUnique({
      where: { id },
      include: {
        proyecto: true,
        asigna: true,
        asignado: true,
        historicos: {
          include:{
            usuarioAccion: true,
          },
          orderBy: {
            fecha: 'asc'
          }
        }
      },
    });

    return this.normalizarTarea(tarea);
  }

async update(id: number, dto: UpdateTareaDto) {
  const tarea = await this.prisma.tarea.findUnique({
    where: { id },
    include: { asignado: true },
  });

  if (!tarea) {
    throw new NotFoundException('La tarea no existe');
  }

  const data: any = {};

  if (dto.descripcion !== undefined) {
    data.descripcion = dto.descripcion;
  }

  if (dto.idUsuarioAsignado !== undefined) {
    if (dto.idUsuarioAsignado !== null) {
      const usuarioAsignado = await this.prisma.usuario.findUnique({
        where: { id: dto.idUsuarioAsignado },
      });
      if (!usuarioAsignado) {
        throw new NotFoundException('El usuario asignado no existe');
      }
    }
    data.idUsuarioAsignado = dto.idUsuarioAsignado;
  }

  if (dto.estado !== undefined) {
    if (dto.estado !== tarea.estado) {
      const idUsuarioAccion = tarea.idUsuarioAsigna ?? tarea.idUsuarioAsignado;

      if (idUsuarioAccion !== null && idUsuarioAccion !== undefined) {
        await this.prisma.historico.create({
          data: {
            idTarea: tarea.id,
            idUsuarioAccion,
            accion: AccionHistorico.cambio_estado,
            valorAnterior: tarea.estado,
            valorNuevo: dto.estado,
          },
        });
      }
    }
    data.estado = dto.estado;
  }

  if (Object.keys(data).length === 0) {
    return this.normalizarTarea(tarea);
  }

  const tareaActualizada = await this.prisma.tarea.update({
    where: { id },
    include: { asignado: true },
    data,
  });

  return this.normalizarTarea(tareaActualizada);
}

  async asignar(id: number, dto: AsignarTareaDto) {
    const tarea = await this.prisma.tarea.findUnique({
      where: { id },
    });

    if (!tarea) {
      throw new NotFoundException('La tarea no existe');
    }

    const usuarioAsigna = await this.prisma.usuario.findUnique({
      where: {
        id: dto.idUsuarioAsigna,
      },
    });

    if (!usuarioAsigna) {
      throw new NotFoundException('El usuario que asigna no existe');
    }

    const usuarioAsignado = await this.prisma.usuario.findUnique({
      where: {
        id: dto.idUsuarioAsignado,
      },
    });

    if (!usuarioAsignado) {
      throw new NotFoundException('El usuario asignado no existe');
    }

    await this.prisma.historico.create({
      data: {
        idTarea: tarea.id,
        idUsuarioAccion: dto.idUsuarioAsigna,
        accion: AccionHistorico.asignacion,
        valorAnterior: 'Sin asignar',
        valorNuevo: usuarioAsignado.nombre,
      },
    });

    const tareaAsignada = await this.prisma.tarea.update({
      where: { id },
      include: { asignado: true },
      data: {
        idUsuarioAsigna: dto.idUsuarioAsigna,
        idUsuarioAsignado: dto.idUsuarioAsignado,
        estado: EstadoTarea.pendiente,
      },
    });

    return this.normalizarTarea(tareaAsignada);
  }

  async reasignar(id: number, dto: ReasignarTareaDto) {
    const tarea = await this.prisma.tarea.findUnique({
      where: { id },
    });

    if (!tarea) {
      throw new NotFoundException('La tarea no existe');
    }

    const usuarioAccion = await this.prisma.usuario.findUnique({
      where: {
        id: dto.idUsuarioAccion,
      },
    });

    if (!usuarioAccion) {
      throw new NotFoundException('El usuario que reasigna no existe');
    }

    const nuevoUsuario = await this.prisma.usuario.findUnique({
      where: {
        id: dto.idNuevoAsignado,
      },
    });

    if (!nuevoUsuario) {
      throw new NotFoundException('El nuevo usuario no existe');
    }

    if (tarea.idUsuarioAsignado === dto.idNuevoAsignado) {
      throw new BadRequestException(
        'La tarea ya está asignada a ese usuario',
      );
    }

    await this.prisma.historico.create({
      data: {
        idTarea: tarea.id,
        idUsuarioAccion: dto.idUsuarioAccion,
        accion: AccionHistorico.reasignacion,
        valorAnterior: tarea.idUsuarioAsignado?.toString() ?? 'Sin asignar',
        valorNuevo: dto.idNuevoAsignado.toString(),
      },
    });

    const tareaReasignada = await this.prisma.tarea.update({
      where: { id },
      include: { asignado: true },
      data: {
        idUsuarioAsignado: dto.idNuevoAsignado,
        estado:
          tarea.estado === EstadoTarea.cancelado
            ? EstadoTarea.pendiente
            : tarea.estado,
      },
    });

    return this.normalizarTarea(tareaReasignada);
  }

  async remove(id: number) {
    return await this.prisma.tarea.delete({
      where: { id },
    });
  }
}