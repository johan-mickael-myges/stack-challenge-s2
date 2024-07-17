const request = require('supertest');
const app = require('../../app');
const { Product } = require('~models');
const jwt = require('jsonwebtoken');
const { uploadToS3, generateFileDestination } = require('~services/s3Service');

jest.mock('jsonwebtoken');

jest.mock('~models', () => ({
    Product: {
        count: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        findByPk: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn(),
    },
}));

jest.mock('~services/s3Service', () => ({
    uploadToS3: jest.fn(),
    generateFileDestination: jest.fn(),
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

    describe('GET /products/:id', () => {
        it('should return a product by id', async () => {
            const mockProduct = {
                id: 1,
                name: 'Test Product',
                reference: '123ABC',
                price: 100.0,
                description: 'A product for testing',
                images: ['http://example.com/image1.jpg'],
                quantity: 10,
                brandId: 1,
            };
            Product.findByPk.mockResolvedValue(mockProduct);

            const response = await request(app).get('/products/1');

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(mockProduct);
        });

        it('should return a 404 status code when the product is not found', async () => {
            Product.findByPk.mockResolvedValue(null);

            const response = await request(app).get('/products/1');

            expect(response.statusCode).toBe(404);
        });

        it('should return a 500 status code when an error occurs', async () => {
            Product.findByPk.mockRejectedValue(new Error('Database error'));

            const response = await request(app).get('/products/1');

            expect(response.statusCode).toBe(500);
        });
    });

    describe('POST /products', () => {
        it('should not be able to create a new product as non admin', async () => {
            const newProduct = {
                name: 'Test Product',
                reference: '123ABC',
                price: 100.0,
                description: 'A product for testing',
                images: ['http://example.com/image1.jpg'],
                quantity: 10,
                brandId: 1,
            };

            const response = await request(app)
                .post('/products')
                .send(newProduct);

            expect(response.statusCode).toBe(401);
        });

        it('should be able to create a new product as admin', async () => {
            const newProduct = {
               name: 'Test Product',
               reference: '123ABCD',
               price: 100.0,
               description: 'A product for testing',
               images: ['https://example.com/image1.jpg'],
               quantity: 10,
               brandId: 1,
            };

            jwt.verify.mockImplementation((token, secret, callback) => {
                callback(null, { id: 1, username: 'testUser', roles: ['ROLE_ADMIN'] });
            });

            generateFileDestination.mockResolvedValue({
                destination: 'products/image1.jpg',
                url: 'https://example.com/image1.jpg',
            });

            uploadToS3.mockResolvedValue('https://example.com/image1.jpg');

            Product.findOne.mockResolvedValue(null);
            Product.create.mockResolvedValue(newProduct);

            const response = await request(app)
                .post('/products')
                .set('Cookie', ['token=valid-token'])
                .send(newProduct);

            expect(response.statusCode).toBe(201);
            expect(response.body).toEqual(newProduct);
        });
    });

    describe('PUT /products/:id', () => {
        let product;
        let updatedProduct;
        let updatedProductEntity;

        beforeEach(() => {
            product = {
                id: 1,
                name: 'Test Product',
                reference: '123ABC',
                price: 100.0,
                description: 'A product for testing',
                images: ['http://example.com/image1.jpg'],
                quantity: 10,
                brandId: 1,
            };

            updatedProduct = {
                id: 1,
                name: 'Test Product updated',
                reference: '123ABC updated',
                price: 200.0,
                description: 'A product for testing updated',
                images: ['http://example.com/image1.jpg'],
                quantity: 20,
                brandId: 2,
            };

            updatedProductEntity = {
                ...updatedProduct,
                update: jest.fn().mockResolvedValue(this)
            };
        });

        it('should not be able to update a product as non admin', async () => {
            const response = await request(app)
                .put('/products/1')
                .send(updatedProduct);

            expect(response.statusCode).toBe(401);
        });

        it('should be able to update a product as admin', async () => {

            jwt.verify.mockImplementation((token, secret, callback) => {
                callback(null, { id: 1, username: 'testUser', roles: ['ROLE_ADMIN'] });
            });

            Product.findByPk.mockResolvedValue(updatedProductEntity);
            Product.update.mockResolvedValue(updatedProduct);

            const response = await request(app)
                .put('/products/1')
                .set('Cookie', ['token=valid-token'])
                .send(updatedProduct);

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(updatedProduct);
        });
    });

    describe('DELETE /products/:id', () => {
        let product;
        let fountProductEntity;

        beforeEach(() => {
            product = {
                id: 1,
                name: 'Test Product',
                reference: '123ABC',
                price: 100.0,
                description: 'A product for testing',
                images: ['http://example.com/image1.jpg'],
                quantity: 10,
                brandId: 1,
            };

            fountProductEntity = {
                ...product,
                destroy: jest.fn().mockResolvedValue(1)
            };
        });

        it('should not be able to delete a product as non admin', async () => {
            const response = await request(app).delete('/products/1');

            expect(response.statusCode).toBe(401);
        });

        it('should be able to delete a product as admin', async () => {
            jwt.verify.mockImplementation((token, secret, callback) => {
                callback(null, { id: 1, username: 'testUser', roles: ['ROLE_ADMIN'] });
            });

            Product.findByPk.mockResolvedValue(fountProductEntity);
            Product.destroy.mockResolvedValue(1);

            const response = await request(app)
                .delete('/products/1')
                .set('Cookie', ['token=valid-token']);

            expect(response.statusCode).toBe(204);
        });
    });
});