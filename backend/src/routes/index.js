const express = require('express');
const router = express.Router();
const errorHandler = require('~middlewares/errorHandler');

const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const brandRoutes = require('./brandRoutes');
const cartRoutes = require('./cartRoutes');
const configRoutes = require('./configRoutes');
const paymentRoutes = require('./paymentRoutes'); // Ensure this file exists

console.log('Loading routes...');

router.use('/auth', authRoutes);
console.log('Auth routes loaded');

router.use('/products', productRoutes);
console.log('Product routes loaded');

router.use('/categories', categoryRoutes);
console.log('Category routes loaded');

router.use('/brands', brandRoutes);
console.log('Brand routes loaded');

router.use('/cart', cartRoutes);
console.log('Cart routes loaded');

router.use('/config', configRoutes);
console.log('Config routes loaded');

router.use('/payment', paymentRoutes);
console.log('Payment routes loaded');

router.use(errorHandler);
console.log('Error handler loaded');

module.exports = router;
