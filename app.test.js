const request = require('supertest');
const app = require('./app');

describe('GET /get-ingredients', () => {
    test('Test if it works (returns 200)', () => {
        return request(app).get('/get-ingredients').expect(200);
    });
});
