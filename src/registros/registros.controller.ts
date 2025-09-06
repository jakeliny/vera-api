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
import { ApiTags } from '@nestjs/swagger';
import { ZodBody } from '../common/decorators/zod-body.decorator';
import {
  CreateRegistroDto,
  CreateRegistroSchema,
  UpdateRegistroDto,
  UpdateRegistroSchema,
} from './dto/create-registro.dto';
import { RegistrosService } from './registros.service';
import { RegistroFilters, PaginationParams } from './dto/filter-registro.dto';
import {
  CreateRegistroSwagger,
  GetAllRegistrosSwagger,
  GetRegistroByIdSwagger,
  UpdateRegistroSwagger,
  DeleteRegistroSwagger,
} from './swagger/registros.swagger';

@ApiTags('registros')
@Controller('registros')
export class RegistrosController {
  constructor(private readonly registrosService: RegistrosService) {}

  @Post()
  @CreateRegistroSwagger()
  async create(
    @ZodBody(CreateRegistroSchema) createRegistroDto: CreateRegistroDto,
    @Res() res: Response,
  ) {
    await this.registrosService.create(createRegistroDto);
    return res.status(HttpStatus.CREATED).send();
  }

  @Get()
  @GetAllRegistrosSwagger()
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

    const pagination: PaginationParams = {
      page: queryParams.page ? Number(queryParams.page) : 0,
      limit: queryParams.limit ? Number(queryParams.limit) : 8,
      order: queryParams.order || 'admissionDate',
      orderBy: queryParams.orderBy || 'desc',
    };

    if (
      !['employee', 'admissionDate', 'salary', 'calculatedSalary'].includes(
        pagination.order,
      )
    ) {
      pagination.order = 'admissionDate';
    }

    if (!['asc', 'desc'].includes(pagination.orderBy)) {
      pagination.orderBy = 'desc';
    }

    const result = await this.registrosService.findAllPaginated(
      filters,
      pagination,
    );
    return res.status(HttpStatus.OK).json(result);
  }

  @Get(':id')
  @GetRegistroByIdSwagger()
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const [error, registro] = await this.registrosService.findOne(id);

    if (error) {
      throw error;
    }

    return res.status(HttpStatus.OK).json(registro);
  }

  @Patch(':id')
  @UpdateRegistroSwagger()
  async patch(
    @Param('id') id: string,
    @ZodBody(UpdateRegistroSchema) updateRegistroDto: UpdateRegistroDto,
    @Res() res: Response,
  ) {
    const [error] = await this.registrosService.patch(id, updateRegistroDto);

    if (error) {
      throw error;
    }

    return res.status(HttpStatus.CREATED).send();
  }

  @Delete(':id')
  @DeleteRegistroSwagger()
  async remove(@Param('id') id: string, @Res() res: Response) {
    const [error] = await this.registrosService.remove(id);

    if (error) {
      throw error;
    }

    return res.status(HttpStatus.CREATED).send();
  }
}
