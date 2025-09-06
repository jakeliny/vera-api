import { Inject, Injectable } from '@nestjs/common';
import {
  CreateRegistroDto,
  UpdateRegistroDto,
} from './dto/create-registro.dto';
import { Registro } from './entities/registro.entity';
import { IRegistrosRepository } from './interfaces/registros-repository.interface';
import { DateUtils } from '../common/utils/date.utils';
import { RegistroFilters } from './dto/filter-registro.dto';
import { SalaryUtils } from '../common/utils/salary.utils';

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

  async findOne(id: string): Promise<[Error, null] | [null, Registro]> {
    const registro = await this.registrosRepository.getById(id);

    if (!registro) {
      return [new Error('Registro not found'), null];
    }

    const registroWithCalculatedDate = {
      ...registro,
      calculatedAdmissionDate: DateUtils.calculateElapsedTime(
        registro.admissionDate,
      ),
    };

    return [null, registroWithCalculatedDate] as [null, Registro];
  }

  async update(
    id: string,
    updateData: UpdateRegistroDto,
  ): Promise<[Error, null] | [null, Registro]> {
    const existingRegistro = await this.registrosRepository.getById(id);

    if (!existingRegistro) {
      return [new Error('Registro not found'), null];
    }

    let calculatedSalary = existingRegistro.calculatedSalary;

    if (updateData.salary) {
      calculatedSalary = this.calculateSalaryPercentage(updateData.salary, 35);
    }

    const updatedRegistro = await this.registrosRepository.put(id, {
      ...updateData,
      calculatedSalary,
    });

    if (!updatedRegistro) {
      return [new Error('Failed to update registro'), null];
    }

    return [null, updatedRegistro] as [null, Registro];
  }
  async remove(id: string): Promise<[Error, null] | [null, boolean]> {
    const deleted = await this.registrosRepository.delete(id);

    if (!deleted) {
      return [new Error('Registro not found'), null];
    }

    return [null, deleted] as [null, boolean];
  }
}
