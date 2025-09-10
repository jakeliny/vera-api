import { z } from 'zod';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ErrorMessages } from '../../common/enums/error-messages.enum';

const salary = {
  minimum: 1,
  maximum: 100000,
};

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
    .min(salary.minimum, ErrorMessages.SALARY_MINIMUM)
    .max(salary.maximum, ErrorMessages.SALARY_MAXIMUM),
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
    .min(salary.minimum, ErrorMessages.SALARY_MINIMUM)
    .max(salary.maximum, ErrorMessages.SALARY_MAXIMUM)
    .optional(),
  employee: z
    .string()
    .min(1, ErrorMessages.EMPLOYEE_NAME_REQUIRED)
    .max(30, ErrorMessages.EMPLOYEE_NAME_MAX_LENGTH)
    .optional(),
});

export type CreateRegistroDto = z.infer<typeof CreateRegistroSchema>;
export type UpdateRegistroDto = z.infer<typeof UpdateRegistroSchema>;

export class CreateRegistroSwaggerDto {
  @ApiProperty({
    description: 'Employee admission date in YYYY-MM-DD format',
    example: '2023-01-15',
    pattern: '^\\d{4}-\\d{2}-\\d{2}$',
  })
  admissionDate: string;

  @ApiProperty({
    description: 'Employee base salary (minimum 1, maximum 100,000)',
    example: 5000,
    minimum: salary.minimum,
    maximum: salary.maximum,
  })
  salary: number;

  @ApiProperty({
    description: 'Employee name (1-30 characters)',
    example: 'João Silva',
    minLength: 1,
    maxLength: 30,
  })
  employee: string;
}

export class UpdateRegistroSwaggerDto {
  @ApiPropertyOptional({
    description: 'Employee admission date in YYYY-MM-DD format',
    example: '2023-01-15',
    pattern: '^\\d{4}-\\d{2}-\\d{2}$',
  })
  admissionDate?: string;

  @ApiPropertyOptional({
    description: 'Employee base salary (minimum 1, maximum 100,000)',
    example: 6000,
    minimum: salary.minimum,
    maximum: salary.maximum,
  })
  salary?: number;

  @ApiPropertyOptional({
    description: 'Employee name (1-30 characters)',
    example: 'Maria Santos',
    minLength: 1,
    maxLength: 30,
  })
  employee?: string;
}
