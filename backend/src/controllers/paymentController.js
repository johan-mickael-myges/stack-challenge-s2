const paypal = require('@paypal/checkout-server-sdk');
const paypalService = require('~services/paypalService');
const eventEmitter = require('~services/eventEmitter');

const environment = new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_SECRET);
const client = new paypal.core.PayPalHttpClient(environment);

exports.createOrder = async (req, res, next) => {
    const {totalPrice} = req.body;

    try {
        const order = await paypalService.createOrder(totalPrice);
        res.status(order.statusCode).json(order.result.id);
    } catch (error) {
        next(error)
    }
};

exports.captureOrder = async (req, res, next) => {
    const {orderID, internalOrderId} = req.body;

    try {
        const order = await paypalService.captureOrder(orderID);

        eventEmitter.emit('paypalOrderCaptured', {
            internalOrderId,
            order: order.result
        });

        res.json(order.result);
    } catch (err) {
        next(err);
    }
};
