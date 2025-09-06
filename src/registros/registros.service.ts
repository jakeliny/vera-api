import { Inject, Injectable } from '@nestjs/common';
import {
  CreateRegistroDto,
  UpdateRegistroDto,
} from './dto/create-registro.dto';
import { Registro } from './entities/registro.entity';
import { IRegistrosRepository } from './interfaces/registros-repository.interface';
import { DateUtils } from '../common/utils/date.utils';
import {
  RegistroFilters,
  PaginationParams,
  PaginatedResponse,
} from './dto/filter-registro.dto';
import { SalaryUtils } from '../common/utils/salary.utils';
import { ErrorMessages } from '../common/enums/error-messages.enum';

@Injectable()
export class RegistrosService {
  constructor(
    @Inject('IRegistrosRepository')
    private readonly registrosRepository: IRegistrosRepository,
  ) {}

  async create(createRegistroDto: CreateRegistroDto): Promise<Registro> {
    const calculatedSalary = SalaryUtils.calculateSalaryPercentage(
      createRegistroDto.salary,
      35,
    );
    const calculatedAdmissionDate = DateUtils.calculateElapsedTime(
      createRegistroDto.admissionDate,
    );

    const registro = new Registro(
      createRegistroDto.admissionDate,
      createRegistroDto.salary,
      calculatedSalary,
      createRegistroDto.employee,
      undefined,
      calculatedAdmissionDate,
    );

    return this.registrosRepository.insert(registro);
  }

  async findAll(filters?: RegistroFilters): Promise<Registro[]> {
    const registros = await this.registrosRepository.get(filters);
    return registros.map((registro) => ({
      ...registro,
      calculatedAdmissionDate: DateUtils.calculateElapsedTime(
        registro.admissionDate,
      ),
    }));
  }

  async findAllPaginated(
    filters?: RegistroFilters,
    pagination?: PaginationParams,
  ): Promise<PaginatedResponse<Registro>> {
    const result = await this.registrosRepository.getPaginated(
      filters,
      pagination,
    );
    return {
      ...result,
      data: result.data.map((registro) => ({
        ...registro,
        calculatedAdmissionDate: DateUtils.calculateElapsedTime(
          registro.admissionDate,
        ),
      })),
    };
  }

  async findOne(id: string): Promise<[Error, null] | [null, Registro]> {
    const registro = await this.registrosRepository.getById(id);

    if (!registro) {
      return [new Error(ErrorMessages.REGISTRO_NOT_FOUND), null];
    }

    const registroWithCalculatedDate = {
      ...registro,
      calculatedAdmissionDate: DateUtils.calculateElapsedTime(
        registro.admissionDate,
      ),
    };

    return [null, registroWithCalculatedDate] as [null, Registro];
  }

  async patch(
    id: string,
    updateData: UpdateRegistroDto,
  ): Promise<[Error, null] | [null, Registro]> {
    const existingRegistro = await this.registrosRepository.getById(id);

    if (!existingRegistro) {
      return [new Error(ErrorMessages.REGISTRO_NOT_FOUND), null];
    }

    const allowedFields = ['employee', 'salary', 'admissionDate'];
    const filteredUpdateData = Object.keys(updateData)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updateData[key as keyof UpdateRegistroDto];
        return obj;
      }, {} as any);

    let calculatedSalary = existingRegistro.calculatedSalary;

    if (filteredUpdateData.salary) {
      calculatedSalary = SalaryUtils.calculateSalaryPercentage(
        filteredUpdateData.salary,
        35,
      );
    }

    const updatedRegistro = await this.registrosRepository.put(id, {
      ...filteredUpdateData,
      calculatedSalary,
    });

    if (!updatedRegistro) {
      return [new Error(ErrorMessages.FAILED_TO_UPDATE_REGISTRO), null];
    }

    const registroWithCalculatedDate = {
      ...updatedRegistro,
      calculatedAdmissionDate: DateUtils.calculateElapsedTime(
        updatedRegistro.admissionDate,
      ),
    };

    return [null, registroWithCalculatedDate] as [null, Registro];
  }

  async remove(id: string): Promise<[Error, null] | [null, boolean]> {
    const deleted = await this.registrosRepository.delete(id);

    if (!deleted) {
      return [new Error(ErrorMessages.REGISTRO_NOT_FOUND), null];
    }

    return [null, deleted] as [null, boolean];
  }
}
