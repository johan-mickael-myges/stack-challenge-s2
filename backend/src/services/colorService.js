const { Color } = require('~models');
const BadRequestError = require("~errors/BadRequestError");
const NotFoundError = require("~errors/NotFoundError");
const eventEmitter = require('~services/eventEmitter');

const countColor = async() => {
    return Color.count();
}

const deleteColor = async(colorId) => {
    if (!colorId) {
        throw new BadRequestError("Color ID is required");
    }

    const color = await Color.findByPk(colorId);

    if (!color) {
        throw new NotFoundError('Color not found');
    }

    const remainingColors = await countColor();
    if (remainingColors === 1) {
        throw new BadRequestError('Cannot delete the last color');
    }

    await color.destroy();

    eventEmitter.emit('colorDeleted', color.name);
}

module.exports = {
    countColor,
    deleteColor,
};