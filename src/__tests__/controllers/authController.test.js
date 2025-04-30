const request = require('supertest');
const app = require('../../index');
const seedAll = require('../../seeders/seed');

describe('Auth Controller', () => {
  afterAll(async () => {
    seedAll()
  });

  describe('POST /api/register', () => {
    it('should register a new user', async () => {
      const res = await request(app).post('/api/register').send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });

  describe('POST /api/login', () => {
    it('should login an existing user', async () => {
      const res = await request(app).post('/api/login').send({
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });
});
