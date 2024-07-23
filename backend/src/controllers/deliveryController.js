const deliveryService = require('~services/deliveryService');

exports.addDelivery = async (req, res, next) => {
    try {
        const { orderId, shippingMethodId, address, firstName, lastName, phoneNumber } = req.body;
        const delivery = await deliveryService.addDelivery(orderId, shippingMethodId, address, firstName, lastName, phoneNumber);
        res.status(201).send(delivery);
    } catch (error) {
        next(error);
    }
};