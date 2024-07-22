const productListener = require('~listeners/productListeners');
const paypalListener = require('~listeners/paypalListeners');

const subscribeToAppEvents = () => {
    productListener;
    paypalListener;
}

module.exports = subscribeToAppEvents;