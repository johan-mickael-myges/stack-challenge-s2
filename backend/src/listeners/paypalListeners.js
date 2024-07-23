const eventEmitter = require('~services/eventEmitter');
const { Payment, Order } = require('~models');

eventEmitter.on('paypalOrderCaptured', async (data) => {
    const { internalOrderId, order } = data;
    const { amount } = order.purchase_units[0].payments.captures[0];

    console.log('Order captured:', amount);

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

        console.log(`Payment record created for order ${internalOrderId}`);

        const [updatedRows] = await Order.update(
            { paymentStatus: 'paid' },
            { where: { id: internalOrderId } }
        );
    } catch (error) {
        console.error('Error processing PayPal order captured event:', error);
    }
});

module.exports = eventEmitter;
