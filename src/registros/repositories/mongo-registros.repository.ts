import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, Types } from 'mongoose';
import { IRegistrosRepository } from '../interfaces/registros-repository.interface';
import { Registro } from '../entities/registro.entity';
import { RegistroDocument } from '../schemas/registro.schema';
import {
  RegistroFilters,
  PaginationParams,
  PaginatedResponse,
} from '../dto/filter-registro.dto';

@Injectable()
export class MongoRegistrosRepository implements IRegistrosRepository {
  constructor(
    @InjectModel(RegistroDocument.name)
    private readonly registroModel: Model<RegistroDocument>,
  ) {}

  private toEntity(doc: RegistroDocument): Registro {
    return new Registro(
      doc.admissionDate,
      doc.salary,
      doc.calculatedSalary,
      doc.employee,
      doc._id.toString(),
      doc.calculatedAdmissionDate,
    );
  }

  private addRangeFilter(
    query: FilterQuery<RegistroDocument>,
    field: string,
    startValue?: number | string,
    endValue?: number | string,
  ): void {
    if (startValue === undefined && endValue === undefined) return;

    const rangeFilter: any = {};
    if (startValue !== undefined) rangeFilter.$gte = startValue;
    if (endValue !== undefined) rangeFilter.$lte = endValue;

    if (Object.keys(rangeFilter).length > 0) {
      query[field] = rangeFilter;
    }
  }

  private isValidObjectId(id: string): boolean {
    return Types.ObjectId.isValid(id);
  }

  private buildFilterQuery(
    filters?: RegistroFilters,
  ): FilterQuery<RegistroDocument> {
    if (!filters) return {};

    const query: FilterQuery<RegistroDocument> = {};
    const conditions: FilterQuery<RegistroDocument>[] = [];

    if (filters.id && this.isValidObjectId(filters.id)) {
      conditions.push({ _id: filters.id });
    }

    this.addRangeFilter(
      query,
      'admissionDate',
      filters.startDate,
      filters.endDate,
    );
    this.addRangeFilter(
      query,
      'salary',
      filters.startSalary,
      filters.endSalary,
    );
    this.addRangeFilter(
      query,
      'calculatedSalary',
      filters.startSalaryCalculated,
      filters.endSalaryCalculated,
    );

    if (filters.employee?.trim()) {
      conditions.push({
        employee: {
          $regex: filters.employee
            .trim()
            .replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
          $options: 'i',
        },
      });
    }

    return conditions.length > 0 ? { ...query, $and: conditions } : query;
  }

  async insert(registro: Registro): Promise<Registro> {
    try {
      const registroData = {
        admissionDate: registro.admissionDate,
        salary: registro.salary,
        calculatedSalary: registro.calculatedSalary,
        employee: registro.employee,
        calculatedAdmissionDate: registro.calculatedAdmissionDate,
      };

      const savedRegistro = await this.registroModel.create(registroData);
      return this.toEntity(savedRegistro);
    } catch (error) {
      throw new Error(`Failed to insert registro: ${error.message}`);
    }
  }

  async get(filters?: RegistroFilters): Promise<Registro[]> {
    try {
      const query = this.buildFilterQuery(filters);
      const docs = await this.registroModel.find(query).lean().exec();
      return docs.map((doc) => this.toEntity(doc as RegistroDocument));
    } catch (error) {
      throw new Error(`Failed to fetch registros: ${error.message}`);
    }
  }

  async getPaginated(
    filters?: RegistroFilters,
    pagination?: PaginationParams,
  ): Promise<PaginatedResponse<Registro>> {
    try {
      const query = this.buildFilterQuery(filters);

      const page = Math.max(0, pagination?.page || 0);
      const limit = Math.min(100, Math.max(1, pagination?.limit || 8));
      const order = pagination?.order || 'admissionDate';
      const orderBy = pagination?.orderBy || 'asc';

      const sortOptions: Record<string, 1 | -1> = {
        [order]: orderBy === 'asc' ? 1 : -1,
      };

      const [total, docs] = await Promise.all([
        this.registroModel.countDocuments(query).exec(),
        this.registroModel
          .find(query)
          .sort(sortOptions)
          .skip(page * limit)
          .limit(limit)
          .lean()
          .exec(),
      ]);

      const data = docs.map((doc) => this.toEntity(doc as RegistroDocument));

      return {
        total,
        page,
        totalPages: Math.ceil(total / limit),
        limit,
        data,
      };
    } catch (error) {
      throw new Error(`Failed to fetch paginated registros: ${error.message}`);
    }
  }

  async getById(id: string): Promise<Registro | null> {
    try {
      if (!this.isValidObjectId(id)) {
        return null;
      }

      const doc = await this.registroModel.findById(id).lean().exec();

      return doc ? this.toEntity(doc as RegistroDocument) : null;
    } catch (error) {
      throw new Error(`Failed to fetch registro by id: ${error.message}`);
    }
  }

  async put(
    id: string,
    updateData: Partial<Registro>,
  ): Promise<Registro | null> {
    try {
      if (!this.isValidObjectId(id)) {
        return null;
      }

      const updateFields = Object.fromEntries(
        Object.entries({
          admissionDate: updateData.admissionDate,
          salary: updateData.salary,
          calculatedSalary: updateData.calculatedSalary,
          employee: updateData.employee,
          calculatedAdmissionDate: updateData.calculatedAdmissionDate,
        }).filter(([, value]) => value !== undefined && value !== null),
      );

      if (Object.keys(updateFields).length === 0) {
        return this.getById(id);
      }

      const doc = await this.registroModel
        .findByIdAndUpdate(
          id,
          { $set: updateFields },
          { new: true, lean: true, runValidators: true },
        )
        .exec();

      return doc ? this.toEntity(doc as RegistroDocument) : null;
    } catch (error) {
      throw new Error(`Failed to update registro: ${error.message}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      if (!this.isValidObjectId(id)) {
        return false;
      }

      const result = await this.registroModel
        .findByIdAndDelete(id)
        .lean()
        .exec();

      return result !== null;
    } catch (error) {
      throw new Error(`Failed to delete registro: ${error.message}`);
    }
  }
}
