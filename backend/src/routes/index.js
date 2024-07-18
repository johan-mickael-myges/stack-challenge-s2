const express = require('express');
const router = express.Router();
const errorHandler = require('~middlewares/errorHandler');
const sendMail = require('~services/mailerService');

const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const brandRoutes = require('./brandRoutes');
const cartRoutes = require('./cartRoutes');
const configRoutes = require('./configRoutes');
const paymentRoutes = require('./paymentRoutes');
const orderRoutes = require('./orderRoutes');

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/brands', brandRoutes);
router.use('/carts', cartRoutes);
router.use('/config', configRoutes);
router.use('/payment', paymentRoutes);
router.use('/orders', orderRoutes);
router.use(errorHandler);

router.get('/test', async (req, res) => {
    await sendMail('m.johan.rkt@gmail.com', 'Test', '<h1>Test</h1>');

    res.send('Mail route');
});

module.exports = router;