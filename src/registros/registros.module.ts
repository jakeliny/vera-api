import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { RegistrosController } from './registros.controller';
import { RegistrosService } from './registros.service';
import { InMemoryRegistrosRepository } from './repositories/in-memory-registros.repository';
import { GlobalExceptionFilter } from '../common/filters/global-exception.filter';

@Module({
  controllers: [RegistrosController],
  providers: [
    RegistrosService,
    {
      provide: 'IRegistrosRepository',
      useClass: InMemoryRegistrosRepository,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class RegistrosModule {}
