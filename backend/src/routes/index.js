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


router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/brands', brandRoutes);
router.use('/carts', cartRoutes);
router.use('/config', configRoutes);
router.use('/payment', paymentRoutes);

router.use(errorHandler);

module.exports = router;