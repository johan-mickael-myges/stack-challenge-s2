const express = require('express');
const router = express.Router();
const {
  getPayPalClient,
} = require('~controllers/configController');

router.get('/paypal-client', getPayPalClient);

module.exports = router;
