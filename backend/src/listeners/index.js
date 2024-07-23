const productListener = require('~listeners/productListeners');
const categoryListener = require('~listeners/categoryListeners');
const brandListener = require('~listeners/brandListeners');
const paypalListener = require('~listeners/paypalListeners');
const colorListener = require('~listeners/colorListeners');
const materialListener = require('~listeners/materialListeners');

const subscribeToAppEvents = () => {
    productListener;
    categoryListener;
    brandListener;
    paypalListener;
    colorListener;
    materialListener;
}

module.exports = subscribeToAppEvents;