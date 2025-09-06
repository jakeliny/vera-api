import { z } from 'zod';

const today = new Date();
today.setHours(0, 0, 0, 0);

export const CreateRegistroSchema = z.object({
  admissionDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .refine((date) => {
      const inputDate = new Date(date);
      return inputDate <= today;
    }, 'Admission date cannot be in the future'),
  salary: z
    .number()
    .positive('Salary must be positive')
    .min(1300, 'Salary must be at least 1300')
    .max(100000, 'Salary cannot exceed 100,000'),
  employee: z
    .string()
    .min(1, 'Employee name is required')
    .max(30, 'Employee name cannot exceed 30 characters'),
});

export const UpdateRegistroSchema = z.object({
  admissionDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .refine((date) => {
      const inputDate = new Date(date);
      return inputDate <= today;
    }, 'Admission date cannot be in the future')
    .optional(),
  salary: z
    .number()
    .positive('Salary must be positive')
    .min(1300, 'Salary must be at least 1300')
    .max(100000, 'Salary cannot exceed 100,000')
    .optional(),
  employee: z
    .string()
    .min(1, 'Employee name is required')
    .max(30, 'Employee name cannot exceed 30 characters')
    .optional(),
});

export type CreateRegistroDto = z.infer<typeof CreateRegistroSchema>;
export type UpdateRegistroDto = z.infer<typeof UpdateRegistroSchema>;
