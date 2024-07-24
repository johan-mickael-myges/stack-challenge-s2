const { Category } = require('~models');
const categoryService = require('~services/categoryService');
const eventEmitter = require('~services/eventEmitter');
const BadRequestError = require("~errors/BadRequestError");
const NotFoundError = require("~errors/NotFoundError");

jest.mock('~models', () => ({
    Category: {
        count: jest.fn(),
        findByPk: jest.fn(),
    }
}));

jest.mock('~services/eventEmitter', () => ({
    emit: jest.fn(),
}));

describe('categoryService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('countCategory', () => {
        it('should return the category count', async () => {
            Category.count.mockResolvedValue(10);
            const result = await categoryService.countCategory();
            expect(result).toBe(10);
            expect(Category.count).toHaveBeenCalledTimes(1);
        });
    });

    describe('deleteCategory', () => {
        it('should throw BadRequestError if no categoryId is provided', async () => {
            await expect(categoryService.deleteCategory()).rejects.toThrow(BadRequestError);
        });

        it('should throw NotFoundError if category is not found', async () => {
            Category.findByPk.mockResolvedValue(null);
            await expect(categoryService.deleteCategory(1)).rejects.toThrow(NotFoundError);
        });

        it('should throw BadRequestError if trying to delete the last category', async () => {
            Category.findByPk.mockResolvedValue({ id: 1, name: 'Electronics', destroy: jest.fn() });
            Category.count.mockResolvedValue(1);
            await expect(categoryService.deleteCategory(1)).rejects.toThrow(BadRequestError);
        });

        it('should delete the category and emit event', async () => {
            const mockCategory = { id: 1, name: 'Electronics', destroy: jest.fn() };
            Category.findByPk.mockResolvedValue(mockCategory);
            Category.count.mockResolvedValue(2);

            await categoryService.deleteCategory(1);

            expect(Category.findByPk).toHaveBeenCalledWith(1);
            expect(mockCategory.destroy).toHaveBeenCalledTimes(1);
            expect(eventEmitter.emit).toHaveBeenCalledWith('categoryDeleted', mockCategory.name);
        });
    });
});
