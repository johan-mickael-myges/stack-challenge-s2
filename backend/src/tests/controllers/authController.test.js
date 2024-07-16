const request = require('supertest');
const app = require('../../app');
const jwt = require('jsonwebtoken');
const checkToken = require('../../middlewares/authMiddleware');
const UnauthorizedError = require('../../errors/UnauthorizedError');

jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
    beforeAll(() => {

    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    describe('GET /check', () => {
        it('should respond with 200 if token is valid', async () => {
            jwt.verify.mockImplementation((token, secret, callback) => {
                callback(null, { id: 1, username: 'testUser', roles: ['user'] });
            });

            const response = await request(app)
                    .get('/auth/check')
                    .set('Cookie', ['token=valid-token']);

            expect(response.statusCode).toBe(200);
            expect(jwt.verify).toHaveBeenCalledWith('valid-token', expect.any(String), expect.any(Function));
        });

        it('should respond with 401 if token is invalid', async () => {
            jwt.verify.mockImplementation((token, secret, callback) => {
                callback(new UnauthorizedError(), null);
            });

            const response = await request(app)
                    .get('/auth/check')
                    .set('Cookie', ['token=invalid-token']);

            expect(response.statusCode).toBe(401);
            expect(jwt.verify).toHaveBeenCalledWith('invalid-token', expect.any(String), expect.any(Function));
        });
    });
});