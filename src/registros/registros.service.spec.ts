import { Test, TestingModule } from '@nestjs/testing';
import { RegistrosService } from './registros.service';
import { IRegistrosRepository } from './interfaces/registros-repository.interface';
import { Registro } from './entities/registro.entity';
import { CreateRegistroDto } from './dto/create-registro.dto';

describe('RegistrosService', () => {
  let service: RegistrosService;
  let repository: IRegistrosRepository;

  const mockRepository: IRegistrosRepository = {
    insert: jest.fn(),
    get: jest.fn(),
    getById: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegistrosService,
        {
          provide: 'IRegistrosRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<RegistrosService>(RegistrosService);
    repository = module.get<IRegistrosRepository>('IRegistrosRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a registro with calculated salary', async () => {
      const createRegistroDto: CreateRegistroDto = {
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

      jest.spyOn(repository, 'insert').mockResolvedValue(expectedRegistro);

      const result = await service.create(createRegistroDto);

      expect(repository.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          admissionDate: '2024-01-15',
          salary: 5000,
          calculatedSalary: 1750,
          employee: 'John Doe',
        }),
      );
      expect(result).toEqual(expectedRegistro);
    });

    it('should calculate 35% of salary with 2 decimal places', async () => {
      const createRegistroDto: CreateRegistroDto = {
        admissionDate: '2024-01-15',
        salary: 1357,
        employee: 'Jane Smith',
      };

      const expectedCalculatedSalary = 474.95;
      jest
        .spyOn(repository, 'insert')
        .mockImplementation(async (registro) => registro);

      await service.create(createRegistroDto);

      expect(repository.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          calculatedSalary: expectedCalculatedSalary,
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return registro when found', async () => {
      const registro = new Registro(
        '2024-01-15',
        5000,
        1750,
        'John Doe',
        'test-id',
      );
      jest.spyOn(repository, 'getById').mockResolvedValue(registro);

      const [error, result] = await service.findOne('test-id');

      expect(error).toBeNull();
      expect(result).toEqual(registro);
    });

    it('should return error when registro not found', async () => {
      jest.spyOn(repository, 'getById').mockResolvedValue(null);

      const [error, result] = await service.findOne('non-existent-id');

      expect(error).toBeInstanceOf(Error);
      expect(error?.message).toBe('Registro not found');
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update registro and recalculate salary when salary is updated', async () => {
      const existingRegistro = new Registro(
        '2024-01-15',
        5000,
        1750,
        'John Doe',
        'test-id',
      );
      const updateData = { salary: 6000 };
      const updatedRegistro = {
        ...existingRegistro,
        salary: 6000,
        calculatedSalary: 2100,
      };

      jest.spyOn(repository, 'getById').mockResolvedValue(existingRegistro);
      jest.spyOn(repository, 'put').mockResolvedValue(updatedRegistro);

      const [error, result] = await service.update('test-id', updateData);

      expect(error).toBeNull();
      expect(result).toEqual(updatedRegistro);
      expect(repository.put).toHaveBeenCalledWith('test-id', {
        salary: 6000,
        calculatedSalary: 2100,
      });
    });

    it('should return error when registro not found', async () => {
      jest.spyOn(repository, 'getById').mockResolvedValue(null);

      const [error, result] = await service.update('non-existent-id', {
        employee: 'New Name',
      });

      expect(error).toBeInstanceOf(Error);
      expect(error?.message).toBe('Registro not found');
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should remove registro successfully', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue(true);

      const [error, result] = await service.remove('test-id');

      expect(error).toBeNull();
      expect(result).toBe(true);
    });

    it('should return error when registro not found', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue(false);

      const [error, result] = await service.remove('non-existent-id');

      expect(error).toBeInstanceOf(Error);
      expect(error?.message).toBe('Registro not found');
      expect(result).toBeNull();
    });
  });
});
