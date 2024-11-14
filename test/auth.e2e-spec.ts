import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';
import { DataSource } from 'typeorm';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    dataSource = moduleFixture.get<DataSource>(DataSource);
    await app.init();
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    await dataSource.destroy();
    await app.close();
  });

  it('POST /auth/register - register a new user', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'test@example.com', password: 'password123' })
      .expect(201)
      .then((response) => {
        expect(response.body.user).toHaveProperty('id');
        expect(response.body.user.email).toBe('test@example.com');
      });
  });

  it('POST /auth/register - fail with duplicate email', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'duplicate@example.com', password: 'password123' });

    return request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'duplicate@example.com', password: 'password123' })
      .expect(409);
  });

  it('POST /auth/login - successful login', async () => {
    const email = 'login.test@example.com';
    const password = 'password123';

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password });

    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('token');
      });
  });

  it('POST /auth/login - fail with wrong credentials', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'wrong@example.com', password: 'wrongpass' })
      .expect(401);
  });
});
