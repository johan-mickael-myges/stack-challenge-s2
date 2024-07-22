const paypal = require('@paypal/checkout-server-sdk');
const configService = require('./configService');
const { BadRequestError } = require('~errors/BadRequestError');

const getEnvironment = async () => {
    const client = await configService.getConfig('paypal.client');
    const secret = await configService.getConfig('paypal.secret');

    return new paypal.core.SandboxEnvironment(client.value, secret.value);
}

const getClient = async () => {
    const environment = await getEnvironment();
    return new paypal.core.PayPalHttpClient(environment);
}

const makeOrderRequestInstance = () => {
    return new paypal.orders.OrdersCreateRequest();
}

const makeCaptureRequestInstance = (orderID) => {
    if (!orderID) {
        throw new BadRequestError('OrderID is required.');
    }

    return new paypal.orders.OrdersCaptureRequest(orderID);
}

const createOrder = async (totalPrice) => {
    const client = await getClient();
    const request = makeOrderRequestInstance();

    request.prefer("return=representation");
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
            amount: {
                currency_code: 'EUR',
                value: totalPrice
            }
        }]
    });

    return await client.execute(request);
}

const captureOrder = async (orderID) => {
    const client = await getClient();
    const request = makeCaptureRequestInstance(orderID);

    request.requestBody({});

    return await client.execute(request);
}

module.exports = {
    createOrder,
    captureOrder
}