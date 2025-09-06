import { Injectable } from '@nestjs/common';
import { IRegistrosRepository } from '../interfaces/registros-repository.interface';
import { Registro } from '../entities/registro.entity';

@Injectable()
export class InMemoryRegistrosRepository implements IRegistrosRepository {
  private registros: Registro[] = [];

  async insert(registro: Registro): Promise<Registro> {
    this.registros.push(registro);
    return registro;
  }

  async get(): Promise<Registro[]> {
    return [...this.registros];
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
