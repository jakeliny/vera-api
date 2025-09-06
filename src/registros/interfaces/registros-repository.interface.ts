import { Registro } from '../entities/registro.entity';
import {
  RegistroFilters,
  PaginationParams,
  PaginatedResponse,
} from '../dto/filter-registro.dto';

export interface IRegistrosRepository {
  insert(registro: Registro): Promise<Registro>;
  get(filters?: RegistroFilters): Promise<Registro[]>;
  getPaginated(
    filters?: RegistroFilters,
    pagination?: PaginationParams,
  ): Promise<PaginatedResponse<Registro>>;
  getById(id: string): Promise<Registro | null>;
  put(id: string, registro: Partial<Registro>): Promise<Registro | null>;
  delete(id: string): Promise<boolean>;
}
