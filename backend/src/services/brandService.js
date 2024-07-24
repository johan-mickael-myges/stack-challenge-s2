const {Brand} = require('~models');
const BadRequestError = require("~errors/BadRequestError");
const NotFoundError = require("~errors/NotFoundError");
const eventEmitter = require('~services/eventEmitter');

const countBrand = async() => {
    return Brand.count();
}

const deleteBrand = async(brandId) => {
    if (!brandId) {
        throw new BadRequestError("brand ID is required");
    }

    const brand = await Brand.findByPk(brandId);

    if (!brand) {
        throw new NotFoundError('Brand not found');
    }

    const remainingBrands = await countBrand();
    if (remainingBrands === 1) {
        throw new BadRequestError('Cannot delete the last brand');
    }

    await brand.destroy();

    eventEmitter.emit('brandDeleted', brand.name);
}

module.exports = {
    countBrand,
    deleteBrand,
};
