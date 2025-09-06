import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Patch,
  Res,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ZodBody } from '../common/decorators/zod-body.decorator';
import {
  CreateRegistroDto,
  CreateRegistroSchema,
  UpdateRegistroDto,
  UpdateRegistroSchema,
  CreateRegistroSwaggerDto,
  UpdateRegistroSwaggerDto,
} from './dto/create-registro.dto';
import { RegistrosService } from './registros.service';
import { RegistroFilters } from './dto/filter-registro.dto';

@ApiTags('registros')
@Controller('registros')
export class RegistrosController {
  constructor(private readonly registrosService: RegistrosService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new registro',
    description:
      'Creates a new employee registry entry with salary calculations',
  })
  @ApiBody({
    type: CreateRegistroSwaggerDto,
    description: 'Registry data',
    examples: {
      example1: {
        summary: 'Standard employee entry',
        value: {
          admissionDate: '2023-01-15',
          salary: 5000,
          employee: 'João Silva',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Registry created successfully',
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        admissionDate: '2023-01-15',
        salary: 5000,
        calculatedSalary: 1750.0,
        employee: 'João Silva',
        createdAt: '2024-01-15T10:30:00.000Z',
        calculatedAdmissionDate: '1 year, 2 months e 10 days',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data',
    schema: {
      example: {
        status: 400,
        message: 'Salário deve ser no mínimo 1300',
        timeStamp: '2024-01-15 10:30:00',
      },
    },
  })
  async create(
    @ZodBody(CreateRegistroSchema) createRegistroDto: CreateRegistroDto,
    @Res() res: Response,
  ) {
    const registro = await this.registrosService.create(createRegistroDto);
    return res.status(HttpStatus.CREATED).json(registro);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all registros',
    description: 'Retrieves all employee registries with optional filtering',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Filter by start admission date (YYYY-MM-DD)',
    example: '2023-01-01',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Filter by end admission date (YYYY-MM-DD)',
    example: '2023-12-31',
  })
  @ApiQuery({
    name: 'startSalary',
    required: false,
    description: 'Filter by minimum salary',
    example: 2000,
  })
  @ApiQuery({
    name: 'endSalary',
    required: false,
    description: 'Filter by maximum salary',
    example: 10000,
  })
  @ApiQuery({
    name: 'employee',
    required: false,
    description: 'Filter by employee name',
    example: 'João',
  })
  @ApiQuery({
    name: 'id',
    required: false,
    description: 'Filter by specific ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'List of registries',
    schema: {
      example: [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          admissionDate: '2023-01-15',
          salary: 5000,
          calculatedSalary: 1750.0,
          employee: 'João Silva',
          createdAt: '2024-01-15T10:30:00.000Z',
          calculatedAdmissionDate: '1 year, 2 months e 10 days',
        },
      ],
    },
  })
  async findAll(@Query() queryParams: any, @Res() res: Response) {
    const filters: RegistroFilters = {};

    if (queryParams.startDate) filters.startDate = queryParams.startDate;
    if (queryParams.endDate) filters.endDate = queryParams.endDate;
    if (queryParams.startSalary)
      filters.startSalary = Number(queryParams.startSalary);
    if (queryParams.endSalary)
      filters.endSalary = Number(queryParams.endSalary);
    if (queryParams.startSalaryCalculated)
      filters.startSalaryCalculated = Number(queryParams.startSalaryCalculated);
    if (queryParams.endSalaryCalculated)
      filters.endSalaryCalculated = Number(queryParams.endSalaryCalculated);
    if (queryParams.employee) filters.employee = queryParams.employee;
    if (queryParams.id) filters.id = queryParams.id;

    const registros = await this.registrosService.findAll(filters);
    return res.status(HttpStatus.OK).json(registros);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get registro by ID',
    description: 'Retrieves a specific employee registry by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Registry unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Registry found',
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        admissionDate: '2023-01-15',
        salary: 5000,
        calculatedSalary: 1750.0,
        employee: 'João Silva',
        createdAt: '2024-01-15T10:30:00.000Z',
        calculatedAdmissionDate: '1 year, 2 months e 10 days',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Registry not found',
    schema: {
      example: {
        status: 404,
        message: 'Registro não encontrado',
        timeStamp: '2024-01-15 10:30:00',
      },
    },
  })
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const [error, registro] = await this.registrosService.findOne(id);

    if (error) {
      throw error;
    }

    return res.status(HttpStatus.OK).json(registro);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update registro by ID',
    description: 'Updates a specific employee registry by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Registry unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({
    type: UpdateRegistroSwaggerDto,
    description: 'Updated registry data (partial)',
    examples: {
      example1: {
        summary: 'Update salary',
        value: {
          salary: 6000,
        },
      },
      example2: {
        summary: 'Update employee name',
        value: {
          employee: 'Maria Santos',
        },
      },
      example3: {
        summary: 'Update multiple fields',
        value: {
          salary: 7000,
          employee: 'Pedro Costa',
          admissionDate: '2023-06-01',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Registry updated successfully',
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        admissionDate: '2023-06-01',
        salary: 7000,
        calculatedSalary: 2450.0,
        employee: 'Pedro Costa',
        createdAt: '2024-01-15T10:30:00.000Z',
        calculatedAdmissionDate: '8 months e 15 days',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Registry not found',
    schema: {
      example: {
        status: 404,
        message: 'Registro não encontrado',
        timeStamp: '2024-01-15 10:30:00',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data',
    schema: {
      example: {
        status: 400,
        message: 'Salário deve ser no mínimo 1300',
        timeStamp: '2024-01-15 10:30:00',
      },
    },
  })
  async patch(
    @Param('id') id: string,
    @ZodBody(UpdateRegistroSchema) updateRegistroDto: UpdateRegistroDto,
    @Res() res: Response,
  ) {
    const [error, registro] = await this.registrosService.patch(
      id,
      updateRegistroDto,
    );

    if (error) {
      throw error;
    }

    return res.status(HttpStatus.OK).json(registro);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete registro by ID',
    description: 'Deletes a specific employee registry by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Registry unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 204,
    description: 'Registry deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Registry not found',
    schema: {
      example: {
        status: 404,
        message: 'Registro não encontrado',
        timeStamp: '2024-01-15 10:30:00',
      },
    },
  })
  async remove(@Param('id') id: string, @Res() res: Response) {
    const [error] = await this.registrosService.remove(id);

    if (error) {
      throw error;
    }

    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
