const request = require('supertest');
const app = require('../../app');
const { Category } = require('~models');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const eventEmitter = require('~services/eventEmitter');

jest.mock('jsonwebtoken');

jest.mock('~models', () => ({
    Category: {
        count: jest.fn(),
        findAll: jest.fn(),
        findByPk: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn(),
        findOne: jest.fn(),
    },
}));

jest.mock('express-validator', () => {
    const originalModule = jest.requireActual('express-validator');
    return {
        ...originalModule,
        validationResult: jest.fn(),
    };
});

jest.mock('~services/eventEmitter', () => ({
    emit: jest.fn(),
    on: jest.fn(),
}));

describe('Category Controller', () => {
    beforeAll(() => { });

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

        it('should return a list of categories', async () => {
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
            expect(response.error.text).toBe('Database error');
        });
    });

    describe('GET /categories/:id', () => {
        it('should return a category by id', async () => {
            const mockCategory = {
                id: 1,
                name: 'Test Category',
            };
            Category.findByPk.mockResolvedValue(mockCategory);

            const response = await request(app).get('/categories/1');

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(mockCategory);
        });

        it('should return a 404 status code when the category is not found', async () => {
            Category.findByPk.mockResolvedValue(null);

            const response = await request(app).get('/categories/1');

            expect(response.statusCode).toBe(404);
            expect(response.error.text).toBe('Not Found');
        });

        it('should return a 500 status code when an error occurs', async () => {
            Category.findByPk.mockRejectedValue(new Error('Database error'));

            const response = await request(app).get('/categories/1');

            expect(response.statusCode).toBe(500);
            expect(response.error.text).toBe('Database error');
        });
    });

    describe('POST /categories', () => {
        it('should return 400 if validation fails', async () => {
            const newCategory = {
                name: '',
            };

            const errors = [
                { msg: 'Le nom est requis', param: 'name' },
                { msg: 'Le nom doit comporter entre 1 et 255 caractères', param: 'name' },
            ];

            validationResult.mockReturnValue({
                isEmpty: () => false,
                array: () => errors,
            });

            jwt.verify.mockImplementation((token, secret, callback) => {
                callback(null, { id: 1, username: 'testUser', roles: ['ROLE_ADMIN'] });
            });

            const response = await request(app)
                    .post('/categories')
                    .set('Cookie', ['token=valid-token'])
                    .send(newCategory);

            expect(response.statusCode).toBe(400);
            expect(response.error.text).toBe(JSON.stringify(errors));
            expect(response.body).toEqual(errors);
        });

        it('should be able to create a new category as admin', async () => {
            const newCategory = {
                name: 'Test Category',
            };

            validationResult.mockReturnValue({
                isEmpty: () => true,
                array: () => [],
            });

            jwt.verify.mockImplementation((token, secret, callback) => {
                callback(null, { roles: ['ROLE_ADMIN'] });
            });

            Category.create.mockResolvedValue(newCategory);

            const response = await request(app)
                    .post('/categories')
                    .set('Cookie', ['token=valid-token'])
                    .send(newCategory);

            expect(response.statusCode).toBe(201);
            expect(response.body).toEqual(newCategory);
        });
    });

    describe('PUT /categories/:id', () => {
        let category;
        let updatedCategory;
        let updatedCategoryEntity;

        beforeEach(() => {
            category = {
                id: 1,
                name: 'Test Category',
            };

            updatedCategory = {
                id: 1,
                name: 'Updated Category',
            };

            updatedCategoryEntity = {
                ...updatedCategory,
                update: jest.fn().mockResolvedValue(this)
            };
        });

        it('should return 400 if validation fails', async () => {
            const invalidUpdatedCategory = {
                id: 1,
                name: '',
            };

            const errors = [
                { msg: 'Le nom est requis', param: 'name' },
                { msg: 'Le nom doit comporter entre 1 et 255 caractères', param: 'name' },
            ];

            validationResult.mockReturnValue({
                isEmpty: () => false,
                array: () => errors,
            });

            jwt.verify.mockImplementation((token, secret, callback) => {
                callback(null, { roles: ['ROLE_ADMIN'] });
            });

            const response = await request(app)
                    .put('/categories/1')
                    .set('Cookie', ['token=valid-token'])
                    .send(invalidUpdatedCategory);

            expect(response.statusCode).toBe(400);
            expect(response.error.text).toBe(JSON.stringify(errors))
            expect(response.body).toEqual(errors);
        });

        it('should be able to update a category as admin', async () => {
            validationResult.mockReturnValue({
                isEmpty: () => true,
                array: () => [],
            });

            jwt.verify.mockImplementation((token, secret, callback) => {
                callback(null, { roles: ['ROLE_ADMIN'] });
            });

            Category.findByPk.mockResolvedValue(updatedCategoryEntity);

            const response = await request(app)
                    .put('/categories/1')
                    .set('Cookie', ['token=valid-token'])
                    .send(updatedCategory);

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(updatedCategory);
            expect(eventEmitter.emit).toHaveBeenCalledWith('categoryUpdated', updatedCategory.name, updatedCategory.name);
        });
    });

    describe('DELETE /categories/:id', () => {
        let category;
        let foundCategoryEntity;

        beforeEach(() => {
            category = {
                id: 1,
                name: 'Test Category',
            };

            foundCategoryEntity = {
                ...category,
                destroy: jest.fn().mockResolvedValue(1)
            };
        });

        it('should not be able to delete a category as non admin', async () => {
            const response = await request(app).delete('/categories/1');

            expect(response.statusCode).toBe(401);
            expect(response.error.text).toBe('Unauthorized');
        });

        it('should be able to delete a category as admin', async () => {
            jwt.verify.mockImplementation((token, secret, callback) => {
                callback(null, { roles: ['ROLE_ADMIN'] });
            });

            Category.findByPk.mockResolvedValue(foundCategoryEntity);

            const response = await request(app)
                    .delete('/categories/1')
                    .set('Cookie', ['token=valid-token']);

            expect(response.statusCode).toBe(204);
            expect(eventEmitter.emit).toHaveBeenCalledWith('categoryDeleted', category.name);
        });
    });
});
