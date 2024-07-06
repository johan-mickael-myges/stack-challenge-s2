const express = require('express');
const router = express.Router();

router.get('/paypal-client-id', (req, res) => {
  res.json({ clientId: process.env.PAYPAL_CLIENT_ID });
});

module.exports = router;
