const { Color } = require('~models');
const colorService = require('~services/colorService');
const eventEmitter = require('~services/eventEmitter');
const BadRequestError = require("~errors/BadRequestError");
const NotFoundError = require("~errors/NotFoundError");

jest.mock('~models', () => ({
    Color: {
        count: jest.fn(),
        findByPk: jest.fn(),
    }
}));

jest.mock('~services/eventEmitter', () => ({
    emit: jest.fn(),
    on: jest.fn(),
}));

describe('colorService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('countColor', () => {
        it('should return the color count', async () => {
            Color.count.mockResolvedValue(10);
            const result = await colorService.countColor();
            expect(result).toBe(10);
            expect(Color.count).toHaveBeenCalledTimes(1);
        });
    });

    describe('deleteColor', () => {
        it('should throw BadRequestError if no colorId is provided', async () => {
            await expect(colorService.deleteColor()).rejects.toThrow(BadRequestError);
        });

        it('should throw NotFoundError if color is not found', async () => {
            Color.findByPk.mockResolvedValue(null);
            await expect(colorService.deleteColor(1)).rejects.toThrow(NotFoundError);
        });

        it('should throw BadRequestError if trying to delete the last color', async () => {
            Color.findByPk.mockResolvedValue({ id: 1, name: 'Red', destroy: jest.fn() });
            Color.count.mockResolvedValue(1);
            await expect(colorService.deleteColor(1)).rejects.toThrow(BadRequestError);
        });

        it('should delete the color and emit event', async () => {
            const mockColor = { id: 1, name: 'Red', destroy: jest.fn() };
            Color.findByPk.mockResolvedValue(mockColor);
            Color.count.mockResolvedValue(2);

            await colorService.deleteColor(1);

            expect(Color.findByPk).toHaveBeenCalledWith(1);
            expect(mockColor.destroy).toHaveBeenCalledTimes(1);
            expect(eventEmitter.emit).toHaveBeenCalledWith('colorDeleted', mockColor.name);
        });
    });
});
