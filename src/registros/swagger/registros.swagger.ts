import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import {
  CreateRegistroSwaggerDto,
  UpdateRegistroSwaggerDto,
} from '../dto/create-registro.dto';

export const REGISTRO_EXAMPLES = {
  createRequest: {
    admissionDate: '2023-01-15',
    salary: 5000,
    employee: 'João Silva',
  },

  registroResponse: {
    id: '550e8400-e29b-41d4-a716-446655440000',
    admissionDate: '2023-01-15',
    salary: 5000,
    calculatedSalary: 1750.0,
    employee: 'João Silva',
    createdAt: '2024-01-15T10:30:00.000Z',
    calculatedAdmissionDate: '1 year, 2 months e 10 days',
  },

  updateRequest: {
    salary: {
      salary: 6000,
    },
    employee: {
      employee: 'Maria Santos',
    },
    multiple: {
      salary: 7000,
      employee: 'Pedro Costa',
      admissionDate: '2023-06-01',
    },
  },

  updatedResponse: {
    id: '550e8400-e29b-41d4-a716-446655440000',
    admissionDate: '2023-06-01',
    salary: 7000,
    calculatedSalary: 2450.0,
    employee: 'Pedro Costa',
    createdAt: '2024-01-15T10:30:00.000Z',
    calculatedAdmissionDate: '8 months e 15 days',
  },
};

export const ERROR_RESPONSES = {
  notFound: {
    status: 404,
    message: 'Registro não encontrado',
    timeStamp: '2024-01-15 10:30:00',
  },

  badRequest: {
    status: 400,
    message: 'Salário deve ser no mínimo 1300',
    timeStamp: '2024-01-15 10:30:00',
  },
};

const commonResponses = {
  notFound: ApiResponse({
    status: 404,
    description: 'Registry not found',
    schema: { example: ERROR_RESPONSES.notFound },
  }),

  badRequest: ApiResponse({
    status: 400,
    description: 'Invalid request data',
    schema: { example: ERROR_RESPONSES.badRequest },
  }),
};

const idParam = ApiParam({
  name: 'id',
  description: 'Registry unique identifier',
  example: '550e8400-e29b-41d4-a716-446655440000',
});

export const CreateRegistroSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Create a new registro',
      description:
        'Creates a new employee registry entry with salary calculations',
    }),
    ApiBody({
      type: CreateRegistroSwaggerDto,
      description: 'Registry data',
      examples: {
        example1: {
          summary: 'Standard employee entry',
          value: REGISTRO_EXAMPLES.createRequest,
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Registry created successfully',
      schema: { example: REGISTRO_EXAMPLES.registroResponse },
    }),
    commonResponses.badRequest,
  );

export const GetAllRegistrosSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get all registros',
      description: 'Retrieves all employee registries with optional filtering',
    }),
    ApiQuery({
      name: 'startDate',
      required: false,
      description: 'Filter by start admission date (YYYY-MM-DD)',
      example: '2023-01-01',
    }),
    ApiQuery({
      name: 'endDate',
      required: false,
      description: 'Filter by end admission date (YYYY-MM-DD)',
      example: '2023-12-31',
    }),
    ApiQuery({
      name: 'startSalary',
      required: false,
      description: 'Filter by minimum salary',
      example: 2000,
    }),
    ApiQuery({
      name: 'endSalary',
      required: false,
      description: 'Filter by maximum salary',
      example: 10000,
    }),
    ApiQuery({
      name: 'employee',
      required: false,
      description: 'Filter by employee name',
      example: 'João',
    }),
    ApiQuery({
      name: 'id',
      required: false,
      description: 'Filter by specific ID',
      example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiResponse({
      status: 200,
      description: 'List of registries',
      schema: { example: [REGISTRO_EXAMPLES.registroResponse] },
    }),
  );

export const GetRegistroByIdSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get registro by ID',
      description: 'Retrieves a specific employee registry by ID',
    }),
    idParam,
    ApiResponse({
      status: 200,
      description: 'Registry found',
      schema: { example: REGISTRO_EXAMPLES.registroResponse },
    }),
    commonResponses.notFound,
  );

export const UpdateRegistroSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Update registro by ID',
      description: 'Updates a specific employee registry by ID',
    }),
    idParam,
    ApiBody({
      type: UpdateRegistroSwaggerDto,
      description: 'Updated registry data (partial)',
      examples: {
        example1: {
          summary: 'Update salary',
          value: REGISTRO_EXAMPLES.updateRequest.salary,
        },
        example2: {
          summary: 'Update employee name',
          value: REGISTRO_EXAMPLES.updateRequest.employee,
        },
        example3: {
          summary: 'Update multiple fields',
          value: REGISTRO_EXAMPLES.updateRequest.multiple,
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Registry updated successfully',
      schema: { example: REGISTRO_EXAMPLES.updatedResponse },
    }),
    commonResponses.notFound,
    commonResponses.badRequest,
  );

export const DeleteRegistroSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Delete registro by ID',
      description: 'Deletes a specific employee registry by ID',
    }),
    idParam,
    ApiResponse({
      status: 204,
      description: 'Registry deleted successfully',
    }),
    commonResponses.notFound,
  );
