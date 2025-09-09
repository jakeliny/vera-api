import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as request from 'supertest';
import { RegistrosController } from '../src/registros/registros.controller';
import { RegistrosService } from '../src/registros/registros.service';
import { InMemoryRegistrosRepository } from '../src/registros/repositories/in-memory-registros.repository';
import { GlobalExceptionFilter } from '../src/common/filters/global-exception.filter';
import { APP_FILTER } from '@nestjs/core';

describe('RegistrosController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
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
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/registros (POST)', () => {
    it('should create a registro with valid data', () => {
      const createRegistroDto = {
        admissionDate: '2024-01-15',
        salary: 5000,
        employee: 'John Doe',
      };

      return request(app.getHttpServer())
        .post('/registros')
        .send(createRegistroDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual({});
        });
    });

    it('should return 400 for invalid admission date (future date)', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const futureDateString = futureDate.toISOString().split('T')[0];

      const createRegistroDto = {
        admissionDate: futureDateString,
        salary: 5000,
        employee: 'John Doe',
      };

      return request(app.getHttpServer())
        .post('/registros')
        .send(createRegistroDto)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toBe(
            'Data de admissão não pode ser no futuro',
          );
        });
    });

    it('should return 400 for salary below minimum', () => {
      const createRegistroDto = {
        admissionDate: '2024-01-15',
        salary: 1200,
        employee: 'John Doe',
      };

      return request(app.getHttpServer())
        .post('/registros')
        .send(createRegistroDto)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toBe('Salário deve ser no mínimo 1300');
        });
    });

    it('should return 400 for salary above maximum', () => {
      const createRegistroDto = {
        admissionDate: '2024-01-15',
        salary: 150000,
        employee: 'John Doe',
      };

      return request(app.getHttpServer())
        .post('/registros')
        .send(createRegistroDto)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toBe('Salário não pode exceder 100.000');
        });
    });

    it('should return 400 for employee name exceeding 30 characters', () => {
      const createRegistroDto = {
        admissionDate: '2024-01-15',
        salary: 5000,
        employee:
          'This is a very long employee name that exceeds thirty characters',
      };

      return request(app.getHttpServer())
        .post('/registros')
        .send(createRegistroDto)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toBe(
            'Nome do funcionário não pode exceder 30 caracteres',
          );
        });
    });

    it('should return 400 for invalid date format', () => {
      const createRegistroDto = {
        admissionDate: '15/01/2024',
        salary: 5000,
        employee: 'John Doe',
      };

      return request(app.getHttpServer())
        .post('/registros')
        .send(createRegistroDto)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toBe(
            'Data deve estar no formato AAAA-MM-DD',
          );
        });
    });
  });

  describe('/registros (GET)', () => {
    it('should return empty paginated response initially', () => {
      return request(app.getHttpServer())
        .get('/registros')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual({
            total: 0,
            page: 0,
            totalPages: 0,
            limit: 8,
            data: [],
          });
        });
    });

    it('should return all registros after creating some', async () => {
      const registro1 = {
        admissionDate: '2024-01-15',
        salary: 5000,
        employee: 'John Doe',
      };

      const registro2 = {
        admissionDate: '2024-01-16',
        salary: 6000,
        employee: 'Jane Smith',
      };

      await request(app.getHttpServer()).post('/registros').send(registro1);
      await request(app.getHttpServer()).post('/registros').send(registro2);

      return request(app.getHttpServer())
        .get('/registros')
        .expect(200)
        .expect((res) => {
          expect(res.body.total).toBe(2);
          expect(res.body.page).toBe(0);
          expect(res.body.totalPages).toBe(1);
          expect(res.body.limit).toBe(8);
          expect(res.body.data).toHaveLength(2);
          expect(res.body.data[0].employee).toBe('Jane Smith');
          expect(res.body.data[1].employee).toBe('John Doe');
        });
    });
  });

  describe('/registros/:id (GET)', () => {
    it('should return 404 for non-existent registro', () => {
      return request(app.getHttpServer())
        .get('/registros/non-existent-id')
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toBe('Registro não encontrado');
        });
    });

    it('should return registro by id', async () => {
      const createRegistroDto = {
        admissionDate: '2024-01-15',
        salary: 5000,
        employee: 'John Doe',
      };

      await request(app.getHttpServer())
        .post('/registros')
        .send(createRegistroDto);

      const getAllResponse = await request(app.getHttpServer())
        .get('/registros')
        .expect(200);

      const registroId = getAllResponse.body.data[0].id;

      return request(app.getHttpServer())
        .get(`/registros/${registroId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(registroId);
          expect(res.body.employee).toBe('John Doe');
        });
    });
  });

  describe('/registros/:id (PATCH)', () => {
    it('should update a registro', async () => {
      const createRegistroDto = {
        admissionDate: '2024-01-15',
        salary: 5000,
        employee: 'John Doe',
      };

      await request(app.getHttpServer())
        .post('/registros')
        .send(createRegistroDto);

      const getAllResponse = await request(app.getHttpServer())
        .get('/registros')
        .expect(200);

      const registroId = getAllResponse.body.data[0].id;
      const updateData = { salary: 7000 };

      return request(app.getHttpServer())
        .patch(`/registros/${registroId}`)
        .send(updateData)
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual({});
        });
    });

    it('should return 404 for non-existent registro update', () => {
      const updateData = { salary: 7000 };

      return request(app.getHttpServer())
        .patch('/registros/non-existent-id')
        .send(updateData)
        .expect(404);
    });
  });

  describe('/registros/:id (DELETE)', () => {
    it('should delete a registro', async () => {
      const createRegistroDto = {
        admissionDate: '2024-01-15',
        salary: 5000,
        employee: 'John Doe',
      };

      await request(app.getHttpServer())
        .post('/registros')
        .send(createRegistroDto);

      const getAllResponse = await request(app.getHttpServer())
        .get('/registros')
        .expect(200);

      const registroId = getAllResponse.body.data[0].id;

      return request(app.getHttpServer())
        .delete(`/registros/${registroId}`)
        .expect(201);
    });

    it('should return 404 for non-existent registro deletion', () => {
      return request(app.getHttpServer())
        .delete('/registros/non-existent-id')
        .expect(404);
    });
  });
});
