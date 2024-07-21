const {Product, Color, Brand, Category, Material} = require('~models');
const {uploadToS3, generateFileDestination} = require('~services/s3Service');
const eventEmitter = require('~services/eventEmitter');
const productServiceTest = require('~services/productService');
const NotFoundError = require('~errors/NotFoundError');
const BadRequestError = require('~errors/BadRequestError');
const mongoose = require('mongoose');
const MongooseProduct = require('~models/mongoose/Product');

jest.mock('mongoose');
jest.mock('~models/mongoose/Product', () => ({
    aggregate: jest.fn(),
}));

jest.mock('~models', () => ({
    Product: {
        count: jest.fn(),
        findAll: jest.fn(),
        findByPk: jest.fn(),
        create: jest.fn(),
    },
    Color: {
        findAll: jest.fn(),
    },
    Brand: {
        findByPk: jest.fn(),
    },
    Category: {
        findAll: jest.fn(),
    },
    Material: {
        findAll: jest.fn(),
    },
}));

jest.mock('~services/s3Service', () => ({
    uploadToS3: jest.fn(),
    generateFileDestination: jest.fn(),
}));

jest.mock('~services/eventEmitter', () => ({
    emit: jest.fn(),
}));

describe('productService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('countProducts', () => {
        it('should return the product count', async () => {
            Product.count.mockResolvedValue(10);
            const result = await productServiceTest.countProducts();
            expect(result).toBe(10);
            expect(Product.count).toHaveBeenCalledTimes(1);
        });
    });

    describe('getAllProducts', () => {
        it('should return all products', async () => {
            const mockProducts = [{id: 1, name: 'Product 1'}, {id: 2, name: 'Product 2'}];
            Product.findAll.mockResolvedValue(mockProducts);
            const result = await productServiceTest.getAllProducts({});
            expect(result).toEqual(mockProducts);
            expect(Product.findAll).toHaveBeenCalledTimes(1);
        });
    });

    describe('getProductById', () => {
        it('should throw BadRequestError if no productId is provided', async () => {
            await expect(productServiceTest.getProductById()).rejects.toThrow(BadRequestError);
        });

        it('should throw NotFoundError if product is not found', async () => {
            Product.findByPk.mockResolvedValue(null);
            await expect(productServiceTest.getProductById(1)).rejects.toThrow(NotFoundError);
        });

        it('should return the product if found', async () => {
            const mockProduct = {id: 1, name: 'Product 1'};
            Product.findByPk.mockResolvedValue(mockProduct);
            const result = await productServiceTest.getProductById(1);
            expect(result).toEqual(mockProduct);
            expect(Product.findByPk).toHaveBeenCalledWith(1, expect.any(Object));
        });
    });

    describe('createProduct', () => {
        it('should create a new product and emit event', async () => {
            const mockProductData = {name: 'New Product', reference: 'NP123'};
            const mockProduct = {
                id: 1, ...mockProductData,
                setCategories: jest.fn(),
                setColors: jest.fn(),
                setMaterials: jest.fn(),
                setBrand: jest.fn(),
                save: jest.fn(),
            };
            Product.create.mockResolvedValue(mockProduct);

            const result = await productServiceTest.createProduct(mockProductData, {});

            expect(result).toEqual(mockProduct);
            expect(Product.create).toHaveBeenCalledWith(expect.objectContaining(mockProductData));
            expect(eventEmitter.emit).toHaveBeenCalledWith('productCreated', mockProduct);
        });
    });

    describe('updateProduct', () => {
        it('should update an existing product and emit event', async () => {
            const mockProductId = 1;
            const mockProductData = {name: 'Updated Product', reference: 'UP123'};
            const mockProduct = {
                id: 1, ...mockProductData,
                setCategories: jest.fn(),
                setColors: jest.fn(),
                setMaterials: jest.fn(),
                setBrand: jest.fn(),
                update: jest.fn().mockResolvedValue(true),
                save: jest.fn(),
            };
            Product.findByPk.mockResolvedValue(mockProduct);

            const result = await productServiceTest.updateProduct(mockProductId, mockProductData, {});

            expect(result).toEqual(mockProduct);
            expect(Product.findByPk).toHaveBeenCalledWith(mockProductId);
            expect(mockProduct.update).toHaveBeenCalledWith(expect.objectContaining(mockProductData));
            expect(eventEmitter.emit).toHaveBeenCalledWith('productUpdated', {
                productId: mockProductId,
                product: mockProduct,
            });
        });

        it('should throw error if product not found', async () => {
            Product.findByPk.mockResolvedValue(null);
            await expect(productServiceTest.updateProduct(1, {name: 'Product'}, {})).rejects.toThrow('Product not found');
        });
    });

    describe('deleteProduct', () => {
        it('should delete an existing product and emit event', async () => {
            const mockProduct = {id: 1, destroy: jest.fn()};
            Product.findByPk.mockResolvedValue(mockProduct);

            await productServiceTest.deleteProduct(mockProduct.id);

            expect(Product.findByPk).toHaveBeenCalledWith(mockProduct.id);
            expect(mockProduct.destroy).toHaveBeenCalledTimes(1);
            expect(eventEmitter.emit).toHaveBeenCalledWith('productDeleted', mockProduct.id);
        });

        it('should throw error if product not found', async () => {
            Product.findByPk.mockResolvedValue(null);
            await expect(productServiceTest.deleteProduct(1)).rejects.toThrow('Product not found');
        });
    });

    describe('generateFacets', () => {
        it('should return the correct facets', async () => {
            // Mock data to return
            const mockAggregateResponse = [
                {
                    brands: [{ _id: 'Brand A', count: 1 }, { _id: 'Brand B', count: 1 }],
                    categories: [{ _id: 'Category 1', count: 2 }, { _id: 'Category 2', count: 1 }],
                    colors: [{ _id: 'Red', count: 1 }, { _id: 'Blue', count: 1 }, { _id: 'Green', count: 1 }],
                    materials: [{ _id: 'Material 1', count: 2 }, { _id: 'Material 2', count: 1 }],
                    priceRanges: [
                        { range: 0, count: 0 },
                        { range: 100, count: 1 },
                        { range: 200, count: 1 },
                        { range: 300, count: 0 },
                        { range: 400, count: 0 },
                        { range: 500, count: 0 },
                        { range: 1000, count: 0 },
                        { range: 'Other', count: 0 }
                    ],
                    weightRanges: [
                        { range: 0, count: 0 },
                        { range: 1, count: 0 },
                        { range: 2, count: 1 },
                        { range: 3, count: 1 },
                        { range: 4, count: 0 },
                        { range: 5, count: 0 },
                        { range: 10, count: 0 },
                        { range: 'Other', count: 0 }
                    ]
                }
            ];

            MongooseProduct.aggregate.mockResolvedValue(mockAggregateResponse);

            const facets = await productServiceTest.generateFacets();

            expect(MongooseProduct.aggregate).toHaveBeenCalledTimes(1);
            expect(facets).toEqual(mockAggregateResponse);
            expect(facets).toHaveLength(1);
        });
    });
});
