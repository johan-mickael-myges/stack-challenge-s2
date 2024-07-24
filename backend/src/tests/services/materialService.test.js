const { Material } = require('~models');
const materialService = require('~services/materialService');
const eventEmitter = require('~services/eventEmitter');
const BadRequestError = require("~errors/BadRequestError");
const NotFoundError = require("~errors/NotFoundError");

jest.mock('~models', () => ({
    Material: {
        count: jest.fn(),
        findByPk: jest.fn(),
    }
}));

jest.mock('~services/eventEmitter', () => ({
    emit: jest.fn(),
}));

describe('materialService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('countMaterial', () => {
        it('should return the material count', async () => {
            Material.count.mockResolvedValue(10);
            const result = await materialService.countMaterial();
            expect(result).toBe(10);
            expect(Material.count).toHaveBeenCalledTimes(1);
        });
    });

    describe('deleteMaterial', () => {
        it('should throw BadRequestError if no materialId is provided', async () => {
            await expect(materialService.deleteMaterial()).rejects.toThrow(BadRequestError);
        });

        it('should throw NotFoundError if material is not found', async () => {
            Material.findByPk.mockResolvedValue(null);
            await expect(materialService.deleteMaterial(1)).rejects.toThrow(NotFoundError);
        });

        it('should throw BadRequestError if trying to delete the last material', async () => {
            Material.findByPk.mockResolvedValue({ id: 1, name: 'Gold', destroy: jest.fn() });
            Material.count.mockResolvedValue(1);
            await expect(materialService.deleteMaterial(1)).rejects.toThrow(BadRequestError);
        });

        it('should delete the material and emit event', async () => {
            const mockMaterial = { id: 1, name: 'Gold', destroy: jest.fn() };
            Material.findByPk.mockResolvedValue(mockMaterial);
            Material.count.mockResolvedValue(2);

            await materialService.deleteMaterial(1);

            expect(Material.findByPk).toHaveBeenCalledWith(1);
            expect(mockMaterial.destroy).toHaveBeenCalledTimes(1);
            expect(eventEmitter.emit).toHaveBeenCalledWith('materialDeleted', mockMaterial.name);
        });
    });
});
