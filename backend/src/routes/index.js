const express = require('express');
const router = express.Router();
const errorHandler = require('~middlewares/errorHandler');

const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const brandRoutes = require('./brandRoutes');
const cartRoutes = require('./cartRoutes');

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/brands', brandRoutes);
router.use('/carts', cartRoutes);

router.use(errorHandler);

module.exports = router;