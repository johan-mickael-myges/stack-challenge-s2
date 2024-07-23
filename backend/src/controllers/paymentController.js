const paypalService = require('~services/paypalService');
const eventEmitter = require('~services/eventEmitter');
const PaypalError = require('~errors/PaypalError');

exports.createOrder = async (req, res, next) => {
    const {totalPrice} = req.body;

    try {
        const order = await paypalService.createOrder(totalPrice);
        console.log('Order ID', order.result.id);
        res.status(order.statusCode).json(order.result.id);
    } catch (err) {
        const error = new PaypalError(err.statusCode, err.message);
        next(error);
    }
};

exports.captureOrder = async (req, res, next) => {
    const {orderID, internalOrderId} = req.body;

    console.log('Capture orderID', orderID);

    try {
        const order = await paypalService.captureOrder(orderID);

        eventEmitter.emit('paypalOrderCaptured', {
            internalOrderId,
            order: order.result
        });

        res.json(order.result);
    } catch (err) {
        const error = new PaypalError(err.statusCode, err.message);
        next(error);
    }
};
