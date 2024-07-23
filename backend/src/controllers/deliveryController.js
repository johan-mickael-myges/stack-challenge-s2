const deliveryService = require('~services/deliveryService');

exports.getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const delivery = await deliveryService.getById(id);
        res.status(200).send(delivery);
    } catch (err) {
        next(err);
    }
}

exports.addDelivery = async (req, res, next) => {
    try {
        const { orderId, shippingMethodId, address, firstName, lastName, phoneNumber } = req.body;
        const delivery = await deliveryService.addDelivery(orderId, shippingMethodId, address, firstName, lastName, phoneNumber);
        res.status(201).send(delivery);
    } catch (error) {
        next(error);
    }
};