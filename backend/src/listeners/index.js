const productListener = require('~listeners/productListeners');
const categoryListener = require('~listeners/categoryListeners');
const brandListener = require('~listeners/brandListeners');
const paypalListener = require('~listeners/paypalListeners');
const colorListener = require('~listeners/colorListeners');
const materialListener = require('~listeners/materialListeners');
const userListener = require('~listeners/userListeners');
const alertListener = require('~listeners/alertListeners');

const subscribeToAppEvents = () => {
    productListener;
    categoryListener;
    brandListener;
    paypalListener;
    colorListener;
    materialListener;
    alertListener;
    userListener;
}

module.exports = subscribeToAppEvents;