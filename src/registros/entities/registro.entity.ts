import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';

export class Registro {
  @ApiProperty({
    description: 'Unique identifier for the registry',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Employee admission date',
    example: '2023-01-15',
    format: 'date',
  })
  admissionDate: string;

  @ApiProperty({
    description: 'Employee base salary',
    example: 5000,
    minimum: 1,
    maximum: 100000,
  })
  salary: number;

  @ApiProperty({
    description: 'Calculated salary (35% of base salary)',
    example: 1750.0,
  })
  calculatedSalary: number;

  @ApiProperty({
    description: 'Employee name',
    example: 'João Silva',
    maxLength: 30,
    minLength: 1,
  })
  employee: string;

  @ApiProperty({
    description: 'Registry creation timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Calculated time elapsed since admission',
    example: '10 dias, 2 meses e 1 ano',
    required: false,
  })
  calculatedAdmissionDate?: string;

  constructor(
    admissionDate: string,
    salary: number,
    calculatedSalary: number,
    employee: string,
    id?: string,
    calculatedAdmissionDate?: string,
  ) {
    this.id = id || randomUUID();
    this.admissionDate = admissionDate;
    this.salary = salary;
    this.calculatedSalary = calculatedSalary;
    this.employee = employee;
    this.createdAt = new Date();
    this.calculatedAdmissionDate = calculatedAdmissionDate;
  }
}
