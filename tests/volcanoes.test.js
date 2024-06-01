const request = require('supertest');
const app = require('../src/server'); // Adjust the path as necessary

describe('GET /volcanoes', () => {
  it('should return 200 and a list of volcanoes', async () => {
    const response = await request(app).get('/volcanoes?country=Japan');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should return 400 if country query parameter is missing', async () => {
    const response = await request(app).get('/volcanoes');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: true,
      message: 'Missing country query parameter',
    });
  });
});
