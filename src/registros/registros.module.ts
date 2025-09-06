import { Module } from '@nestjs/common';
import { RegistrosController } from './registros.controller';
import { RegistrosService } from './registros.service';

@Module({
  controllers: [RegistrosController],
  providers: [RegistrosService],
})
export class RegistrosModule {}
