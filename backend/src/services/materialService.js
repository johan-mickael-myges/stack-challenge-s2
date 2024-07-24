const { Material } = require('~models');
const BadRequestError = require("~errors/BadRequestError");
const NotFoundError = require("~errors/NotFoundError");
const eventEmitter = require('~services/eventEmitter');

const countMaterial = async() => {
    return Material.count();
}

const deleteMaterial = async(materialId) => {
    if (!materialId) {
        throw new BadRequestError("Material ID is required");
    }

    const material = await Material.findByPk(materialId);

    if (!material) {
        throw new NotFoundError('Material not found');
    }

    const remainingMaterials = await countMaterial();
    if (remainingMaterials === 1) {
        throw new BadRequestError('Impossible de supprimer le dernier matériau');
    }

    await material.destroy();

    eventEmitter.emit('materialDeleted', material.name);
}

module.exports = {
    countMaterial,
    deleteMaterial,
};