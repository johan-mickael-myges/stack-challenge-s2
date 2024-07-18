const request = require('supertest');
const app = require('../../app');
const service = require('~services/stockService');
const { Stock, Product } = require('~models');
const jwt = require('jsonwebtoken');
const { checkToken, authorizeRoles } = require('~middlewares/authMiddleware');
const BadRequestError = require('~errors/BadRequestError');
const NotFoundError = require('~errors/NotFoundError');
const UnauthorizedError = require('~errors/UnauthorizedError');

jest.mock('jsonwebtoken');
jest.mock('~services/stockService');
jest.mock('~models');

describe('Stock Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /products/:id/stocks', () => {
        it('should return 401 if the user is not authenticated', async () => {
            jwt.verify.mockImplementation((token, secret, callback) => {
                callback(new UnauthorizedError());
            });

            const response = await request(app).get('/products/1/stocks');

            expect(response.statusCode).toBe(401);
        });

        it('should return 403 if the user is not authorized', async () => {
            jwt.verify.mockImplementation((token, secret, callback) => {
                callback(null, { roles: ['ROLE_USER'] });
            });

            const response = await request(app)
                    .get('/products/1/stocks')
                    .set('Cookie', ['token=valid-token']);

            expect(response.statusCode).toBe(403);
        });

        it('should return 404 if product is not found', async () => {
            jwt.verify.mockImplementation((token, secret, callback) => {
                callback(null, { id: 1, username: 'testUser', roles: ['ROLE_ADMIN'] });
            });

            service.getAllForProduct.mockRejectedValue(new NotFoundError());

            const response = await request(app)
                    .get('/products/1/stocks')
                    .set('Cookie', ['token=valid-token']);

            expect(response.statusCode).toBe(404);
        });

        it('should return 200 with stocks for the given product ID', async () => {
            jwt.verify.mockImplementation((token, secret, callback) => {
                callback(null, { id: 1, username: 'testUser', roles: ['ROLE_ADMIN'] });
            });

            const mockStocks = [
                { id: 1, type: 'in', quantity: 10, productId: 1 },
                { id: 2, type: 'out', quantity: 5, productId: 1 },
            ];

            service.getAllForProduct.mockResolvedValue(mockStocks);

            const response = await request(app)
                    .get('/products/1/stocks')
                    .set('Cookie', ['token=valid-token']);

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(mockStocks);
        });

        it('should return 500 if an unexpected error occurs', async () => {
            jwt.verify.mockImplementation((token, secret, callback) => {
                callback(null, { id: 1, username: 'testUser', roles: ['ROLE_ADMIN'] });
            });

            service.getAllForProduct.mockRejectedValue(new Error());

            const response = await request(app)
                    .get('/products/1/stocks')
                    .set('Cookie', ['token=valid-token']);

            expect(response.statusCode).toBe(500);
        });
    });
});
