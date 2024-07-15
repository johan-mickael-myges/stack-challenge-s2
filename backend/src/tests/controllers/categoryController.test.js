const request = require('supertest');
const app = require('../../app');
const { Category } = require('~models');

jest.mock('~models', () => ({
    Category: {
        count: jest.fn(),
        findAll: jest.fn(),
        findByPk: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn(),
    },
}));

describe('Category Controller', () => {
    beforeAll(() => {

    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    describe('GET /categories', () => {
        it('should return the categories count', async () => {
            Category.count.mockResolvedValue(10);

            const response = await request(app).get('/categories/count');

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(10);
        });

        it('should return a list of products', async () => {
            const mockCategories = [
                {
                    id: 1,
                    name: 'Test Category',
                },
            ];
            Category.findAll.mockResolvedValue(mockCategories);

            const response = await request(app).get('/categories');

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(expect.arrayContaining(mockCategories));
        });

        it('should return a 500 status code when an error occurs', async () => {
            Category.findAll.mockRejectedValue(new Error('Database error'));

            const response = await request(app).get('/categories');

            expect(response.statusCode).toBe(500);
        });
    });
});