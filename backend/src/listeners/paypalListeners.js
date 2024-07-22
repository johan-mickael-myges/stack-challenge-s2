const eventEmitter = require('~services/eventEmitter');
const {Payment} = require('~models');

eventEmitter.on('paypalOrderCaptured', async (data) => {
    const {internalOrderId, order} = data;
    const {amount} = order.purchase_units[0].payments.captures[0];

    console.log('Order captured:', amount);

    // Create payment record in database
    try {
        await Payment.create({
            orderId: internalOrderId,
            transactionId: order.id,
            paymentMethod: 'PAYPAL',
            status: order.status,
            amount: parseFloat(amount.value),
            currency: amount.currency_code,
            payerEmail: order.payer.email_address,
            payerId: order.payer.payer_id
        });
    } catch (error) {
        console.error(error);
    }
});

module.exports = eventEmitter;