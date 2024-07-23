const { ShippingMethod } = require('~models');

const getAllShippingMethods = async (req, res, next) => {
    try {
        const shippingMethods = await ShippingMethod.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            }
        });
        res.status(200).json(shippingMethods);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllShippingMethods,
}