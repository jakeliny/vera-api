import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { RegistrosService } from './registros.service';

@Controller('registros')
export class RegistrosController {
  constructor(private readonly registrosService: RegistrosService) {}

  @Post()
  async create() {
    return { message: 'Created' };
  }

  @Get()
  async findAll() {
    return { message: 'Found all' };
  }

  @Get(':id')
  async findOne() {
    return { message: 'Found' };
  }

  @Put(':id')
  async update() {
    return { message: 'Updated' };
  }

  @Delete(':id')
  async remove() {
    return { message: 'Deleted' };
  }
}
