import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RegistrosModule } from './registros/registros.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const useDatabase =
          configService.get<string>('USE_DATABASE') === 'true';
        if (useDatabase) {
          return {
            uri: configService.get<string>('MONGODB_URI'),
          };
        }
        return {};
      },
      inject: [ConfigService],
    }),
    RegistrosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
