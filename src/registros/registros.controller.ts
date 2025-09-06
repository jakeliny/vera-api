import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
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
  async findAll(@Res() res: Response) {
    const registros = await this.registrosService.findAll();
    return res.status(HttpStatus.OK).json(registros);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const [error, registro] = await this.registrosService.findOne(id);

    if (error) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: error.message });
    }

    return res.status(HttpStatus.OK).json(registro);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @ZodBody(UpdateRegistroSchema) updateRegistroDto: UpdateRegistroDto,
    @Res() res: Response,
  ) {
    const [error, registro] = await this.registrosService.update(
      id,
      updateRegistroDto,
    );

    if (error) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: error.message });
    }

    return res.status(HttpStatus.OK).json(registro);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const [error] = await this.registrosService.remove(id);

    if (error) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: error.message });
    }

    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
