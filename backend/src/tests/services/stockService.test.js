const { Stock, Product } = require('~models');
const { countStocks, countRemainingForProduct, getAllForProduct } = require('~services/stockService');
const BadRequestError = require('~errors/BadRequestError');
const NotFoundError = require('~errors/NotFoundError');

jest.mock('~models', () => ({
    Stock: {
        findAll: jest.fn(),
    },
    Product: {
        findByPk: jest.fn(),
    },
}));

describe('Stock Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllForProduct', () => {
        it('should throw BadRequestError if productId is not provided', async () => {
            await expect(getAllForProduct()).rejects.toThrow(BadRequestError);
        });

        it('should throw NotFoundError if the product does not exist', async () => {
            Product.findByPk.mockResolvedValue(null);

            await expect(getAllForProduct(1)).rejects.toThrow(NotFoundError);
        });

        it('should return all stocks for the given product ID', async () => {
            const mockProduct = { id: 1, name: 'Test Product' };
            const mockStocks = [
                { id: 1, type: 'in', quantity: 10, productId: 1 },
                { id: 2, type: 'out', quantity: 5, productId: 1 },
            ];

            Product.findByPk.mockResolvedValue(mockProduct);
            Stock.findAll.mockResolvedValue(mockStocks);

            const stocks = await getAllForProduct(1);

            expect(Product.findByPk).toHaveBeenCalledWith(1);
            expect(Stock.findAll).toHaveBeenCalledWith({ where: { productId: 1 } });
            expect(stocks).toEqual(mockStocks);
        });
    });

    describe('count', () => {
        it('should correctly calculate the count for stocks', async () => {
            const mockStocks = [
                { type: 'in', quantity: 10 },
                { type: 'in', quantity: 5 },
                { type: 'out', quantity: 3 },
                { type: 'out', quantity: 2 },
            ];

            const result = await countStocks(mockStocks);
            expect(result).toBe(10); // 10 + 5 - 3 - 2 = 10
        });

        it('should return 0 if no stocks are provided', async () => {
            const result = await countStocks([]);
            expect(result).toBe(0);
        });
    });

    describe('countRemainingForProduct', () => {
        it('should throw BadRequestError if productId is not provided', async () => {
            await expect(countRemainingForProduct()).rejects.toThrow(BadRequestError);
        });

        it('should throw NotFoundError if the product does not exist', async () => {
            Product.findByPk.mockResolvedValue(null);

            await expect(countRemainingForProduct(1)).rejects.toThrow(NotFoundError);
        });

        it('should return the correct remaining count for a product', async () => {
            const mockProduct = { id: 1, name: 'Test Product' };
            const mockStocks = [
                { type: 'in', quantity: 10, productId: 1 },
                { type: 'in', quantity: 5, productId: 1 },
                { type: 'out', quantity: 3, productId: 1 },
                { type: 'out', quantity: 2, productId: 1 },
            ];

            Product.findByPk.mockResolvedValue(mockProduct);
            Stock.findAll.mockResolvedValue(mockStocks);

            const result = await countRemainingForProduct(1);
            expect(result).toBe(10); // 10 + 5 - 3 - 2 = 10
        });
    });
});
