import { EstadoTarea } from '@prisma/client';
import { TareasService } from './tareas.service';

describe('TareasService', () => {
  let service: TareasService;
  const prisma = {
    proyecto: {
      findUnique: jest.fn(),
    },
    tarea: {
      findUnique: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
    usuario: {
      findUnique: jest.fn(),
    },
    historico: {
      create: jest.fn(),
    },
  };

  beforeEach(() => {
    service = new TareasService(prisma as any);
    jest.clearAllMocks();
  });

  it('should return null when a task has no assigned user', async () => {
    prisma.tarea.findUnique.mockResolvedValueOnce({
      id: 7,
      descripcion: 'Diseñar base de datos',
      asignado: null,
    });

    const result = await service.findOne(7);

    expect(result).toEqual({
      id: 7,
      descripcion: 'Diseñar base de datos',
      asignado: null,
    });
  });

  it('should create a task without an assigned user', async () => {
    prisma.proyecto.findUnique.mockResolvedValueOnce({ id: 1 });
    prisma.tarea.create.mockResolvedValueOnce({
      id: 10,
      descripcion: 'tarea_1',
      idProyecto: 1,
      idUsuarioAsigna: null,
      idUsuarioAsignado: null,
      estado: EstadoTarea.por_asignar,
      asignado: null,
    });

    const result = await service.create({
      descripcion: 'tarea_1',
      idProyecto: 1,
      idUsuarioAsigna: null as any,
    });

    expect(result).toEqual({
      id: 10,
      descripcion: 'tarea_1',
      idProyecto: 1,
      idUsuarioAsigna: null,
      idUsuarioAsignado: null,
      estado: EstadoTarea.por_asignar,
      asignado: null,
    });
  });

  it('should assign a task and register history', async () => {
    prisma.tarea.findUnique.mockResolvedValueOnce({ id: 7 });
    prisma.usuario.findUnique
      .mockResolvedValueOnce({ id: 1, nombre: 'Ana' })
      .mockResolvedValueOnce({ id: 2, nombre: 'Luis' });
    prisma.historico.create.mockResolvedValueOnce({ id: 1 });
    prisma.tarea.update.mockResolvedValueOnce({
      id: 7,
      estado: 'pendiente',
      asignado: { id: 2, nombre: 'Luis' },
    });

    const result = await service.asignar(7, {
      idUsuarioAsigna: 1,
      idUsuarioAsignado: 2,
    });

    expect(result).toEqual({
      id: 7,
      estado: 'pendiente',
      asignado: { id: 2, nombre: 'Luis' },
    });
    expect(prisma.tarea.findUnique).toHaveBeenCalledWith({ where: { id: 7 } });
    expect(prisma.usuario.findUnique).toHaveBeenNthCalledWith(1, { where: { id: 1 } });
    expect(prisma.usuario.findUnique).toHaveBeenNthCalledWith(2, { where: { id: 2 } });
    expect(prisma.historico.create).toHaveBeenCalled();
    expect(prisma.tarea.update).toHaveBeenCalledWith({
      where: { id: 7 },
      include: { asignado: true },
      data: {
        idUsuarioAsigna: 1,
        idUsuarioAsignado: 2,
        estado: 'pendiente',
      },
    });
  });

  it('should reassign a canceled task and set it back to pending', async () => {
    prisma.tarea.findUnique.mockResolvedValueOnce({
      id: 7,
      estado: EstadoTarea.cancelado,
      idUsuarioAsignado: 1,
      idUsuarioAsigna: 3,
    });
    prisma.usuario.findUnique
      .mockResolvedValueOnce({ id: 3, nombre: 'Michael' })
      .mockResolvedValueOnce({ id: 5, nombre: 'Kevin' });
    prisma.historico.create.mockResolvedValueOnce({ id: 1 });
    prisma.tarea.update.mockResolvedValueOnce({
      id: 7,
      estado: EstadoTarea.pendiente,
      asignado: { id: 5, nombre: 'Kevin' },
    });

    const result = await service.reasignar(7, {
      idUsuarioAccion: 3,
      idNuevoAsignado: 5,
    });

    expect(result).toEqual({
      id: 7,
      estado: EstadoTarea.pendiente,
      asignado: { id: 5, nombre: 'Kevin' },
    });
    expect(prisma.historico.create).toHaveBeenCalled();
    expect(prisma.tarea.update).toHaveBeenCalledWith({
      where: { id: 7 },
      include: { asignado: true },
      data: {
        idUsuarioAsignado: 5,
        estado: EstadoTarea.pendiente,
      },
    });
  });
});
