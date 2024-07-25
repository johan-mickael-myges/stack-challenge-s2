const express = require('express');
const newsletterController = require('~controllers/newsletterController');
const router = express.Router();
const { checkToken } = require('~middlewares/authMiddleware');

router.post('/subscription', checkToken, newsletterController.subscribe);

module.exports = router;
