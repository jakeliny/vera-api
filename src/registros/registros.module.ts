import { Module } from '@nestjs/common';
import { RegistrosController } from './registros.controller';

@Module({
  controllers: [RegistrosController],
})
export class RegistrosModule {}
