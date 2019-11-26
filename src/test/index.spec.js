const request = require('supertest');
const app = require('../app');

/**
 * Testing get all boards endpoint
 */
describe('GET /api/boards', () => {
  it('respond with json containing a list of all boards', done => {
    request(app)
      .get('/api/boards')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});
