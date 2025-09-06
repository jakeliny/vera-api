import { Test, TestingModule } from '@nestjs/testing';
import { RegistrosService } from './registros.service';
import { IRegistrosRepository } from './interfaces/registros-repository.interface';
import { Registro } from './entities/registro.entity';
import { ErrorMessages } from '../common/enums/error-messages.enum';
import {
  CreateRegistroDto,
  UpdateRegistroDto,
} from './dto/create-registro.dto';
import { RegistroFilters } from './dto/filter-registro.dto';

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
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-20'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should create a registro with calculated salary and admission date', async () => {
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
        '5 days',
      );

      jest.spyOn(repository, 'insert').mockResolvedValue(expectedRegistro);

      const result = await service.create(createRegistroDto);

      expect(repository.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          admissionDate: '2024-01-15',
          salary: 5000,
          calculatedSalary: 1750,
          employee: 'John Doe',
          calculatedAdmissionDate: '5 days',
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

  describe('findAll', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-20'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return all registros with calculated admission date', async () => {
      const registros = [
        new Registro('2024-01-15', 5000, 1750, 'John Doe', 'test-id-1'),
        new Registro('2024-01-10', 6000, 2100, 'Jane Smith', 'test-id-2'),
      ];

      jest.spyOn(repository, 'get').mockResolvedValue(registros);

      const result = await service.findAll();

      expect(repository.get).toHaveBeenCalledWith(undefined);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(
        expect.objectContaining({
          ...registros[0],
          calculatedAdmissionDate: '5 days',
        }),
      );
    });

    it('should pass filters to repository', async () => {
      const filters: RegistroFilters = { startSalary: 5000, endSalary: 10000 };
      jest.spyOn(repository, 'get').mockResolvedValue([]);

      await service.findAll(filters);

      expect(repository.get).toHaveBeenCalledWith(filters);
    });
  });

  describe('findOne', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-20'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return registro with calculated admission date when found', async () => {
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
      expect(result).toEqual(
        expect.objectContaining({
          ...registro,
          calculatedAdmissionDate: '5 days',
        }),
      );
    });

    it('should return error when registro not found', async () => {
      jest.spyOn(repository, 'getById').mockResolvedValue(null);

      const [error, result] = await service.findOne('non-existent-id');

      expect(error).toBeInstanceOf(Error);
      expect(error?.message).toBe(ErrorMessages.REGISTRO_NOT_FOUND);
      expect(result).toBeNull();
    });
  });

  describe('patch', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-20'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should patch registro and recalculate salary when salary is updated', async () => {
      const existingRegistro = new Registro(
        '2024-01-15',
        5000,
        1750,
        'John Doe',
        'test-id',
      );
      const updateData: UpdateRegistroDto = { salary: 6000 };
      const updatedRegistro = {
        ...existingRegistro,
        salary: 6000,
        calculatedSalary: 2100,
      };

      jest.spyOn(repository, 'getById').mockResolvedValue(existingRegistro);
      jest.spyOn(repository, 'put').mockResolvedValue(updatedRegistro);

      const [error, result] = await service.patch('test-id', updateData);

      expect(error).toBeNull();
      expect(result).toEqual(
        expect.objectContaining({
          ...updatedRegistro,
          calculatedAdmissionDate: '5 days',
        }),
      );
      expect(repository.put).toHaveBeenCalledWith('test-id', {
        salary: 6000,
        calculatedSalary: 2100,
      });
    });

    it('should only update allowed fields', async () => {
      const existingRegistro = new Registro(
        '2024-01-15',
        5000,
        1750,
        'John Doe',
        'test-id',
      );
      const updateData = {
        employee: 'New Name',
        salary: 6000,
        calculatedSalary: 9999, // This should be filtered out
        id: 'new-id', // This should be filtered out
      } as any;

      jest.spyOn(repository, 'getById').mockResolvedValue(existingRegistro);
      jest.spyOn(repository, 'put').mockResolvedValue({
        ...existingRegistro,
        employee: 'New Name',
        salary: 6000,
        calculatedSalary: 2100,
      });

      await service.patch('test-id', updateData);

      expect(repository.put).toHaveBeenCalledWith('test-id', {
        employee: 'New Name',
        salary: 6000,
        calculatedSalary: 2100,
      });
    });

    it('should return error when registro not found', async () => {
      jest.spyOn(repository, 'getById').mockResolvedValue(null);

      const [error, result] = await service.patch('non-existent-id', {
        employee: 'New Name',
      });

      expect(error).toBeInstanceOf(Error);
      expect(error?.message).toBe(ErrorMessages.REGISTRO_NOT_FOUND);
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
      expect(error?.message).toBe(ErrorMessages.REGISTRO_NOT_FOUND);
      expect(result).toBeNull();
    });
  });
});
