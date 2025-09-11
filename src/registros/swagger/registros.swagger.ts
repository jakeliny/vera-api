import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import {
  CreateRecordSwaggerDto,
  UpdateRecordSwaggerDto,
} from '../dto/create-registro.dto';

export const RECORD_EXAMPLES = {
  createRequest: {
    admissionDate: '2023-01-15',
    salary: 5000,
    employee: 'John Silva',
  },

  recordResponse: {
    id: '550e8400-e29b-41d4-a716-446655440000',
    admissionDate: '2023-01-15',
    salary: 5000,
    calculatedSalary: 1750.0,
    employee: 'John Silva',
    createdAt: '2024-01-15T10:30:00.000Z',
    calculatedAdmissionDate: '10 days, 2 months and 1 year',
  },

  updateRequest: {
    salary: {
      salary: 6000,
    },
    employee: {
      employee: 'Mary Santos',
    },
    multiple: {
      salary: 7000,
      employee: 'Peter Costa',
      admissionDate: '2023-06-01',
    },
  },

  updatedResponse: {
    id: '550e8400-e29b-41d4-a716-446655440000',
    admissionDate: '2023-06-01',
    salary: 7000,
    calculatedSalary: 2450.0,
    employee: 'Peter Costa',
    createdAt: '2024-01-15T10:30:00.000Z',
    calculatedAdmissionDate: '15 days and 8 months',
  },
};

export const ERROR_RESPONSES = {
  notFound: {
    status: 404,
    message: 'Record not found',
    timeStamp: '2024-01-15 10:30:00',
  },

  badRequest: {
    status: 400,
    message: 'Salary must be at least 1300',
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
      type: CreateRecordSwaggerDto,
      description: 'Registry data',
      examples: {
        example1: {
          summary: 'Standard employee entry',
          value: RECORD_EXAMPLES.createRequest,
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Registry created successfully',
    }),
    commonResponses.badRequest,
  );

export const GetAllRegistrosSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get all registros',
      description:
        'Retrieves all employee registries with optional filtering and pagination',
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
    ApiQuery({
      name: 'page',
      required: false,
      description: 'Page number (default: 0)',
      example: 0,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      description: 'Number of items per page (default: 8)',
      example: 8,
    }),
    ApiQuery({
      name: 'order',
      required: false,
      description: 'Sorting direction (default: desc)',
      enum: ['asc', 'desc'],
      example: 'desc',
    }),
    ApiQuery({
      name: 'orderBy',
      required: false,
      description: 'Field to order by (default: admissionDate)',
      enum: ['employee', 'admissionDate', 'salary', 'calculatedSalary'],
      example: 'admissionDate',
    }),
    ApiResponse({
      status: 200,
      description: 'Paginated list of registries',
      schema: {
        example: {
          total: 25,
          page: 0,
          totalPages: 4,
          limit: 8,
          data: [RECORD_EXAMPLES.recordResponse],
        },
      },
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
      schema: { example: RECORD_EXAMPLES.recordResponse },
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
      type: UpdateRecordSwaggerDto,
      description: 'Updated registry data (partial)',
      examples: {
        example1: {
          summary: 'Update salary',
          value: RECORD_EXAMPLES.updateRequest.salary,
        },
        example2: {
          summary: 'Update employee name',
          value: RECORD_EXAMPLES.updateRequest.employee,
        },
        example3: {
          summary: 'Update multiple fields',
          value: RECORD_EXAMPLES.updateRequest.multiple,
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Registry updated successfully',
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
      status: 201,
      description: 'Registry deleted successfully',
    }),
    commonResponses.notFound,
  );
