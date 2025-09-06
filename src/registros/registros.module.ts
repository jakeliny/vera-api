import { Module } from '@nestjs/common';
import { RegistrosController } from './registros.controller';
import { RegistrosService } from './registros.service';
import { InMemoryRegistrosRepository } from './repositories/in-memory-registros.repository';

@Module({
  controllers: [RegistrosController],
  providers: [
    RegistrosService,
    {
      provide: 'IRegistrosRepository',
      useClass: InMemoryRegistrosRepository,
    },
  ],
})
export class RegistrosModule {}
