import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';
import { DataSource } from 'typeorm';

describe('UrlsController (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;
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

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'testuser@mail.com', password: 'testpass' });

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'testuser@mail.com', password: 'testpass' });

    jwtToken = response.body.token;
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    await dataSource.destroy();
    await app.close();
  });

  it('POST /urls - create a shortened URL', () => {
    return request(app.getHttpServer())
      .post('/urls')
      .send({ originalUrl: 'https://example.com' })
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('shortUrl');
        expect(response.body.originalUrl).toBe('https://example.com');
      });
  });

  it('GET /urls - get all URLs for authenticated user', () => {
    return request(app.getHttpServer())
      .get('/urls')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body)).toBe(true);
      });
  });

  it('PUT /urls/:id - update a URL', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/urls')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ originalUrl: 'https://example.com' });

    const urlId = createResponse.body.id;

    return request(app.getHttpServer())
      .put(`/urls/${urlId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ originalUrl: 'https://updated.com' })
      .expect(200)
      .then((response) => {
        expect(response.body.originalUrl).toBe('https://updated.com');
      });
  });

  it('DELETE /urls/:id - delete a URL', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/urls')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ originalUrl: 'https://delete.com' });

    const urlId = createResponse.body.id;

    return request(app.getHttpServer())
      .delete(`/urls/${urlId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
      .then((response) => {
        expect(response.body.message).toBe('URL deleted successfully');
      });
  });
});
