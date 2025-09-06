import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { ZodBody } from '../common/decorators/zod-body.decorator';
import {
  CreateRegistroDto,
  CreateRegistroSchema,
  UpdateRegistroDto,
  UpdateRegistroSchema,
} from './dto/create-registro.dto';
import { RegistrosService } from './registros.service';
import { RegistroFilters } from './dto/filter-registro.dto';

@Controller('registros')
export class RegistrosController {
  constructor(private readonly registrosService: RegistrosService) {}

  @Post()
  async create(
    @ZodBody(CreateRegistroSchema) createRegistroDto: CreateRegistroDto,
    @Res() res: Response,
  ) {
    const registro = await this.registrosService.create(createRegistroDto);
    return res.status(HttpStatus.CREATED).json(registro);
  }

  @Get()
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
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const [error, registro] = await this.registrosService.findOne(id);

    if (error) {
      throw error;
    }

    return res.status(HttpStatus.OK).json(registro);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @ZodBody(UpdateRegistroSchema) updateRegistroDto: UpdateRegistroDto,
    @Res() res: Response,
  ) {
    const [error, registro] = await this.registrosService.Put(
      id,
      updateRegistroDto,
    );

    if (error) {
      throw error;
    }

    return res.status(HttpStatus.OK).json(registro);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const [error] = await this.registrosService.remove(id);

    if (error) {
      throw error;
    }

    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
