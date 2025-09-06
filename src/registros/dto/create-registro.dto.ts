import { z } from 'zod';
import { ErrorMessages } from '../../common/enums/error-messages.enum';

export const CreateRegistroSchema = z.object({
  admissionDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, ErrorMessages.DATE_FORMAT_INVALID)
    .refine((date) => {
      const inputDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return inputDate <= today;
    }, ErrorMessages.ADMISSION_DATE_FUTURE),
  salary: z
    .number()
    .positive(ErrorMessages.SALARY_MUST_BE_POSITIVE)
    .min(1300, ErrorMessages.SALARY_MINIMUM)
    .max(100000, ErrorMessages.SALARY_MAXIMUM),
  employee: z
    .string()
    .min(1, ErrorMessages.EMPLOYEE_NAME_REQUIRED)
    .max(30, ErrorMessages.EMPLOYEE_NAME_MAX_LENGTH),
});

export const UpdateRegistroSchema = z.object({
  admissionDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, ErrorMessages.DATE_FORMAT_INVALID)
    .refine((date) => {
      const inputDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return inputDate <= today;
    }, ErrorMessages.ADMISSION_DATE_FUTURE)
    .optional(),
  salary: z
    .number()
    .positive(ErrorMessages.SALARY_MUST_BE_POSITIVE)
    .min(1300, ErrorMessages.SALARY_MINIMUM)
    .max(100000, ErrorMessages.SALARY_MAXIMUM)
    .optional(),
  employee: z
    .string()
    .min(1, ErrorMessages.EMPLOYEE_NAME_REQUIRED)
    .max(30, ErrorMessages.EMPLOYEE_NAME_MAX_LENGTH)
    .optional(),
});

export type CreateRegistroDto = z.infer<typeof CreateRegistroSchema>;
export type UpdateRegistroDto = z.infer<typeof UpdateRegistroSchema>;
