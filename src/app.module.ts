import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RegistrosModule } from './registros/registros.module';

@Module({
  imports: [RegistrosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
