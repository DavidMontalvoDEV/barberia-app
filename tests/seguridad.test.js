const request = require('supertest');
const app = require('../src/app');

describe('Protección de rutas (no necesitan base de datos)', () => {
  it('GET /api/citas sin token responde 401', async () => {
    const res = await request(app).get('/api/citas');
    expect(res.status).toBe(401);
  });

  it('POST /api/servicios sin token responde 401', async () => {
    const res = await request(app).post('/api/servicios').send({ nombre: 'Test' });
    expect(res.status).toBe(401);
  });

  it('POST /api/auth/registro con datos inválidos responde 400', async () => {
    const res = await request(app)
      .post('/api/auth/registro')
      .send({ nombre: '', email: 'hola', password: '123' });
    expect(res.status).toBe(400);
  });

  it('una ruta inexistente responde 404', async () => {
    const res = await request(app).get('/api/no-existe');
    expect(res.status).toBe(404);
  });
});
