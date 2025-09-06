import { Test, TestingModule } from '@nestjs/testing';
import { RegistrosController } from './registros.controller';
import { RegistrosService } from './registros.service';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import { Registro } from './entities/registro.entity';

describe('RegistrosController', () => {
  let controller: RegistrosController;
  let service: RegistrosService;

  const mockRegistrosService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegistrosController],
      providers: [
        {
          provide: RegistrosService,
          useValue: mockRegistrosService,
        },
      ],
    }).compile();

    controller = module.get<RegistrosController>(RegistrosController);
    service = module.get<RegistrosService>(RegistrosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a registro and return 201', async () => {
      const createRegistroDto = {
        admissionDate: '2024-01-15',
        salary: 5000,
        employee: 'John Doe',
      };

      const expectedRegistro = new Registro(
        '2024-01-15',
        5000,
        1750,
        'John Doe',
        'test-id',
      );

      jest.spyOn(service, 'create').mockResolvedValue(expectedRegistro);

      await controller.create(createRegistroDto, mockResponse);

      expect(service.create).toHaveBeenCalledWith(createRegistroDto);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(mockResponse.json).toHaveBeenCalledWith(expectedRegistro);
    });
  });

  describe('findAll', () => {
    it('should return all registros with 200 status', async () => {
      const registros = [
        new Registro('2024-01-15', 5000, 1750, 'John Doe', 'test-id-1'),
        new Registro('2024-01-16', 6000, 2100, 'Jane Smith', 'test-id-2'),
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(registros);

      await controller.findAll({}, mockResponse);

      expect(service.findAll).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(registros);
    });

    it('should return 404 when registro not found', async () => {
      const error = new Error('Registro not found');
      jest.spyOn(service, 'findOne').mockResolvedValue([error, null]);

      await controller.findOne('non-existent-id', mockResponse);

      expect(service.findOne).toHaveBeenCalledWith('non-existent-id');
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Registro not found',
      });
    });
  });

  describe('update', () => {
    it('should update registro and return 200', async () => {
      const updateData = { salary: 6000 };
      const updatedRegistro = new Registro(
        '2024-01-15',
        6000,
        2100,
        'John Doe',
        'test-id',
      );

      jest.spyOn(service, 'update').mockResolvedValue([null, updatedRegistro]);

      await controller.update('test-id', updateData, mockResponse);

      expect(service.update).toHaveBeenCalledWith('test-id', updateData);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(updatedRegistro);
    });

    it('should return 404 when registro not found for update', async () => {
      const error = new Error('Registro not found');
      jest.spyOn(service, 'update').mockResolvedValue([error, null]);

      await controller.update(
        'non-existent-id',
        { salary: 6000 },
        mockResponse,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Registro not found',
      });
    });
  });

  describe('remove', () => {
    it('should remove registro and return 204', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue([null, true]);

      await controller.remove('test-id', mockResponse);

      expect(service.remove).toHaveBeenCalledWith('test-id');
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NO_CONTENT);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should return 404 when registro not found for deletion', async () => {
      const error = new Error('Registro not found');
      jest.spyOn(service, 'remove').mockResolvedValue([error, null]);

      await controller.remove('non-existent-id', mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Registro not found',
      });
    });
  });
});
