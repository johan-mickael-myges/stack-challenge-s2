const paypal = require('@paypal/checkout-server-sdk');
const { Payment } = require('../models'); 

const environment = new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_SECRET);
const client = new paypal.core.PayPalHttpClient(environment);

exports.createOrder = async (req, res) => {
  const { totalPrice } = req.body;
  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'EUR',
        value: totalPrice.toFixed(2)
      }
    }]
  });

  try {
    const order = await client.execute(request);
    console.log('PayPal Order Created:', order); 
    res.json({ orderID: order.result.id });
  } catch (err) {
    console.error('Error creating PayPal order:', err);
    res.status(500).send(err.message);
  }
};

exports.captureOrder = async (req, res) => {
  const { orderID, localOrderId } = req.body; 
  const request = new paypal.orders.OrdersCaptureRequest(orderID);
  request.requestBody({});

  try {
    const capture = await client.execute(request);
    console.log('PayPal Order Captured:', capture); 

    const { id, status, purchase_units, payer } = capture.result;
    const { amount } = purchase_units[0].payments.captures[0];

    if (!amount || !payer) {
      throw new Error('Invalid data received from PayPal capture');
    }

    console.log(`Creating payment record with localOrderId: ${localOrderId}`);

    // Create payment record in database
    await Payment.create({
      orderId: localOrderId,
      transactionId: id,
      paymentMethod: 'PAYPAL',
      status,
      amount: parseFloat(amount.value), 
      currency: amount.currency_code,
      payerEmail: payer.email_address,
      payerId: payer.payer_id
    });

    res.json(capture.result);
  } catch (err) {
    console.error('Error capturing PayPal order:', err);
    res.status(500).send(err.message);
  }
};
