import { Test, TestingModule } from '@nestjs/testing';
import { ProyectosService } from './proyectos.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ProyectosService', () => {
  let service: ProyectosService;
  let prisma: {
    usuario: { findUnique: jest.Mock; findFirst: jest.Mock };
    proyecto: { findFirst: jest.Mock; create: jest.Mock };
  };

  beforeEach(async () => {
    prisma = {
      usuario: { findUnique: jest.fn(), findFirst: jest.fn() },
      proyecto: { findFirst: jest.fn(), create: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProyectosService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<ProyectosService>(ProyectosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a project without executor', async () => {
    prisma.usuario.findUnique.mockResolvedValueOnce({ id: 1 });
    prisma.proyecto.findFirst.mockResolvedValueOnce(null);
    prisma.proyecto.create.mockResolvedValueOnce({
      id: 10,
      nombre: 'Proyecto_1',
      descripcion: 'Proyecto_1',
      idUsuarioCreador: 1,
      idUsuarioEjecutor: null,
    });

    const result = await service.create({
      nombre: 'Proyecto_1',
      descripcion: 'Proyecto_1',
      idUsuarioCreador: 1,
    } as any);

    expect(prisma.usuario.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(prisma.proyecto.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        nombre: 'Proyecto_1',
        descripcion: 'Proyecto_1',
        idUsuarioCreador: 1,
      }),
    });
    expect(result.idUsuarioEjecutor).toBeNull();
  });

  it('should use the first user as creator when no creator id is provided', async () => {
    prisma.usuario.findFirst.mockResolvedValueOnce({ id: 2 });
    prisma.usuario.findUnique.mockResolvedValueOnce({ id: 2 });
    prisma.proyecto.findFirst.mockResolvedValueOnce(null);
    prisma.proyecto.create.mockResolvedValueOnce({
      id: 11,
      nombre: 'Proyecto_2',
      descripcion: 'Proyecto_2',
      idUsuarioCreador: 2,
      idUsuarioEjecutor: null,
    });

    const result = await service.create({
      nombre: 'Proyecto_2',
      descripcion: 'Proyecto_2',
    } as any);

    expect(prisma.usuario.findFirst).toHaveBeenCalledWith({
      select: { id: true },
    });
    expect(prisma.proyecto.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        nombre: 'Proyecto_2',
        descripcion: 'Proyecto_2',
        idUsuarioCreador: 2,
      }),
    });
    expect(result.idUsuarioCreador).toBe(2);
  });
});
