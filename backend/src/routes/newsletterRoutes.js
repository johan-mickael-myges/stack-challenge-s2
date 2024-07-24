const express = require('express');
const newsletterController = require('~controllers/newsletterController');
const router = express.Router();
const { checkToken } = require('~middlewares/authMiddleware');

router.post('/subscriptions', checkToken, newsletterController.subscribe);
router.post('/preferences', checkToken, newsletterController.savePreferences);
router.post('/items-preferences', checkToken, newsletterController.saveItemsPreferences);

module.exports = router;
