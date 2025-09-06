import { Injectable } from '@nestjs/common';
import { IRegistrosRepository } from '../interfaces/registros-repository.interface';
import { Registro } from '../entities/registro.entity';
import { RegistroFilters } from '../dto/filter-registro.dto';

@Injectable()
export class InMemoryRegistrosRepository implements IRegistrosRepository {
  private registros: Registro[] = [];

  async insert(registro: Registro): Promise<Registro> {
    this.registros.push(registro);
    return registro;
  }

  async get(filters?: RegistroFilters): Promise<Registro[]> {
    let filteredRegistros = [...this.registros];

    if (!filters) {
      return filteredRegistros;
    }

    if (filters.id) {
      filteredRegistros = filteredRegistros.filter((r) => r.id === filters.id);
    }

    if (filters.startDate) {
      filteredRegistros = filteredRegistros.filter(
        (r) => r.admissionDate >= filters.startDate!,
      );
    }

    if (filters.endDate) {
      filteredRegistros = filteredRegistros.filter(
        (r) => r.admissionDate <= filters.endDate!,
      );
    }

    if (filters.startSalary !== undefined) {
      filteredRegistros = filteredRegistros.filter(
        (r) => r.salary >= filters.startSalary!,
      );
    }

    if (filters.endSalary !== undefined) {
      filteredRegistros = filteredRegistros.filter(
        (r) => r.salary <= filters.endSalary!,
      );
    }

    if (filters.startSalaryCalculated !== undefined) {
      filteredRegistros = filteredRegistros.filter(
        (r) => r.calculatedSalary >= filters.startSalaryCalculated!,
      );
    }

    if (filters.endSalaryCalculated !== undefined) {
      filteredRegistros = filteredRegistros.filter(
        (r) => r.calculatedSalary <= filters.endSalaryCalculated!,
      );
    }

    if (filters.employee) {
      const searchTerm = filters.employee.toLowerCase();
      filteredRegistros = filteredRegistros.filter((r) =>
        r.employee.toLowerCase().includes(searchTerm),
      );
    }

    return filteredRegistros;
  }

  async getById(id: string): Promise<Registro | null> {
    const registro = this.registros.find((r) => r.id === id);
    return registro || null;
  }

  async put(
    id: string,
    updateData: Partial<Registro>,
  ): Promise<Registro | null> {
    const index = this.registros.findIndex((r) => r.id === id);

    if (index === -1) {
      return null;
    }

    this.registros[index] = { ...this.registros[index], ...updateData };
    return this.registros[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.registros.findIndex((r) => r.id === id);

    if (index === -1) {
      return false;
    }

    this.registros.splice(index, 1);
    return true;
  }
}
