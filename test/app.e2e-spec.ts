import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as request from 'supertest';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';
import { RegistrosController } from '../src/registros/registros.controller';
import { RegistrosService } from '../src/registros/registros.service';
import { InMemoryRegistrosRepository } from '../src/registros/repositories/in-memory-registros.repository';
import { GlobalExceptionFilter } from '../src/common/filters/global-exception.filter';
import { APP_FILTER } from '@nestjs/core';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      controllers: [AppController, RegistrosController],
      providers: [
        AppService,
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
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
