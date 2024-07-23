const express = require('express');
const router = express.Router();
const { checkToken, authorizeRoles } = require('~middlewares/authMiddleware');

const {
    getAllShippingMethods,
} = require('~controllers/shippingMethodsController');

router.get('/', checkToken, getAllShippingMethods);

module.exports = router;
