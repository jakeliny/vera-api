import { z } from 'zod';

export const FilterRegistroSchema = z.object({
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .optional(),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .optional(),
  startSalary: z.number().positive('Salary must be positive').optional(),
  endSalary: z.number().positive('Salary must be positive').optional(),
  startSalaryCalculated: z
    .number()
    .positive('Calculated salary must be positive')
    .optional(),
  endSalaryCalculated: z
    .number()
    .positive('Calculated salary must be positive')
    .optional(),
  employee: z.string().optional(),
  id: z.string().uuid('ID must be a valid UUID').optional(),
});

export type FilterRegistroDto = z.infer<typeof FilterRegistroSchema>;

export interface RegistroFilters {
  startDate?: string;
  endDate?: string;
  startSalary?: number;
  endSalary?: number;
  startSalaryCalculated?: number;
  endSalaryCalculated?: number;
  employee?: string;
  id?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  order: 'employee' | 'admissionDate' | 'salary' | 'calculatedSalary';
  orderBy: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  data: T[];
}
