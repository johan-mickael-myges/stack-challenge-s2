const productListener = require('~listeners/productListeners');
const categoryListener = require('~listeners/categoryListeners');
const brandListener = require('~listeners/brandListeners');
const paypalListener = require('~listeners/paypalListeners');

const subscribeToAppEvents = () => {
    productListener;
    categoryListener;
    brandListener;
    paypalListener;
}

module.exports = subscribeToAppEvents;