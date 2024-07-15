const request = require('supertest');
const app = require('../../app');
const { Product } = require('~models');

jest.mock('~models', () => ({
    Product: {
        count: jest.fn(),
        findAll: jest.fn(),
        findByPk: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn(),
    },
}));

describe('Product Controller', () => {
    beforeAll(() => {

    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    describe('GET /products', () => {
        it('should return the products count', async () => {
            Product.count.mockResolvedValue(10);

            const response = await request(app).get('/products/count');

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(10);
        });

        it('should return a list of products', async () => {
            const mockProducts = [
                {
                    id: 1,
                    name: 'Test Product',
                    reference: '123ABC',
                    price: 100.0,
                    description: 'A product for testing',
                    images: ['http://example.com/image1.jpg'],
                    quantity: 10,
                    brandId: 1,
                },
            ];
            Product.findAll.mockResolvedValue(mockProducts);

            const response = await request(app).get('/products');

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(expect.arrayContaining(mockProducts));
        });

        it('should return a 500 status code when an error occurs', async () => {
            Product.findAll.mockRejectedValue(new Error('Database error'));

            const response = await request(app).get('/products');

            expect(response.statusCode).toBe(500);
        });
    });
});