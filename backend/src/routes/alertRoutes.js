const express = require('express');
const alertController = require('~controllers/alertController');
const { checkToken } = require('~middlewares/authMiddleware');

const router = express.Router();

router.get('/', checkToken, alertController.getAlerts);
router.get('/subscription', checkToken, alertController.getAlertSubscriptionForUser);
router.get('/preferences', checkToken, alertController.getAlertPreferencesForUser);
router.get('/preferences/:alertId', checkToken, alertController.getAlertPreferenceForUser);
router.post('/preferences', checkToken, alertController.savePreferences);
router.post('/items-preferences', checkToken, alertController.saveItemsPreferences);

module.exports = router;