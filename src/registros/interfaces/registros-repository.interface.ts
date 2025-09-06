import { Registro } from '../entities/registro.entity';

export interface IRegistrosRepository {
  insert(registro: Registro): Promise<Registro>;
  get(): Promise<Registro[]>;
  getById(id: string): Promise<Registro | null>;
  put(id: string, registro: Partial<Registro>): Promise<Registro | null>;
  delete(id: string): Promise<boolean>;
}
