const express = require('express');
const router = express.Router();
const errorHandler = require('~middlewares/errorHandler');

const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const brandRoutes = require('./brandRoutes');
const cartRoutes = require('./cartRoutes');
const configRoutes = require('./configRoutes');
const paymentRoutes = require('./paymentRoutes');
const orderRoutes = require('./orderRoutes');
const colorRoutes = require('./colorRoutes');
const materialRoutes = require('./materialRoutes');
const shippingMethodRoutes = require('./shippingMethodsRoutes');
const deliveryRoutes = require('./deliveryRoutes');
const newsletterRoutes = require('./newsletterRoutes');

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/brands', brandRoutes);
router.use('/carts', cartRoutes);
router.use('/configs', configRoutes);
router.use('/payments', paymentRoutes);
router.use('/orders', orderRoutes);
router.use('/colors', colorRoutes);
router.use('/materials', materialRoutes);
router.use('/shipping-methods', shippingMethodRoutes);
router.use('/deliveries', deliveryRoutes);
router.use('/newsletters', newsletterRoutes);
router.use(errorHandler);

module.exports = router;