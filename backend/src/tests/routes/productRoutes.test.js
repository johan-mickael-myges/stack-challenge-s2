const request = require('supertest');
const app = require('../../app');
const { Product } = require('~models');

jest.mock('~models', () => ({
    Product: {
        findAndCountAll: jest.fn(),
        findByPk: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn(),
    },
}));

describe('Product Routes', () => {
    beforeAll(() => {

    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    describe('GET /products', () => {
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
            Product.findAndCountAll.mockResolvedValue({
                count: 1,
                rows: mockProducts,
            });

            const response = await request(app).get('/products');

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('total', 1);
            expect(response.body).toHaveProperty('items');
            expect(response.body.items).toEqual(expect.arrayContaining(mockProducts));
        });
    });
});