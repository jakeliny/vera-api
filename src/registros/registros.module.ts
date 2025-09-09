import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RegistrosController } from './registros.controller';
import { RegistrosService } from './registros.service';
import { InMemoryRegistrosRepository } from './repositories/in-memory-registros.repository';
import { MongoRegistrosRepository } from './repositories/mongo-registros.repository';
import { RegistroDocument, RegistroSchema } from './schemas/registro.schema';
import { GlobalExceptionFilter } from '../common/filters/global-exception.filter';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: RegistroDocument.name, schema: RegistroSchema },
    ]),
  ],
  controllers: [RegistrosController],
  providers: [
    RegistrosService,
    InMemoryRegistrosRepository,
    MongoRegistrosRepository,
    {
      provide: 'IRegistrosRepository',
      useFactory: (
        configService: ConfigService,
        inMemoryRepo: InMemoryRegistrosRepository,
        mongoRepo: MongoRegistrosRepository,
      ) => {
        const useDatabase =
          configService.get<string>('USE_DATABASE') === 'true';
        return useDatabase ? mongoRepo : inMemoryRepo;
      },
      inject: [
        ConfigService,
        InMemoryRegistrosRepository,
        MongoRegistrosRepository,
      ],
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class RegistrosModule {}
