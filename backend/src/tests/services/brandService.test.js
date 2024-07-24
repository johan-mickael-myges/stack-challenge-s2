const { Brand } = require('~models');
const brandService = require('~services/brandService');
const eventEmitter = require('~services/eventEmitter');
const BadRequestError = require("~errors/BadRequestError");
const NotFoundError = require("~errors/NotFoundError");

jest.mock('~models', () => ({
    Brand: {
        count: jest.fn(),
        findByPk: jest.fn(),
    }
}));

jest.mock('~services/eventEmitter', () => ({
    emit: jest.fn(),
}));

describe('brandService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('countBrand', () => {
        it('should return the brand count', async () => {
            Brand.count.mockResolvedValue(10);
            const result = await brandService.countBrand();
            expect(result).toBe(10);
            expect(Brand.count).toHaveBeenCalledTimes(1);
        });
    });

    describe('deleteBrand', () => {
        it('should throw BadRequestError if no brandId is provided', async () => {
            await expect(brandService.deleteBrand()).rejects.toThrow(BadRequestError);
        });

        it('should throw NotFoundError if brand is not found', async () => {
            Brand.findByPk.mockResolvedValue(null);
            await expect(brandService.deleteBrand(1)).rejects.toThrow(NotFoundError);
        });

        it('should throw BadRequestError if trying to delete the last brand', async () => {
            Brand.findByPk.mockResolvedValue({ id: 1, name: 'Brand A', destroy: jest.fn() });
            Brand.count.mockResolvedValue(1);
            await expect(brandService.deleteBrand(1)).rejects.toThrow(BadRequestError);
        });

        it('should delete the brand and emit event', async () => {
            const mockBrand = { id: 1, name: 'Brand A', destroy: jest.fn() };
            Brand.findByPk.mockResolvedValue(mockBrand);
            Brand.count.mockResolvedValue(2);

            await brandService.deleteBrand(1);

            expect(Brand.findByPk).toHaveBeenCalledWith(1);
            expect(mockBrand.destroy).toHaveBeenCalledTimes(1);
            expect(eventEmitter.emit).toHaveBeenCalledWith('brandDeleted', mockBrand.name);
        });
    });
});
