const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  getUserOrders,
  deleteUser,
  confirmDeleteUser,
  anonymizeUser,
  confirmAnonymizeUser,
} = require('~controllers/userController');

router.get('/profile', getUserProfile);
router.get('/orders', getUserOrders);
router.post('/delete', deleteUser); // Route pour demander la suppression de compte
router.get('/confirm-delete/:token', confirmDeleteUser); // Route pour confirmer la suppression de compte
router.post('/anonymize', anonymizeUser); // Route pour demander l'anonymisation de compte
router.get('/confirm-anonymize/:token', confirmAnonymizeUser); // Route pour confirmer l'anonymisation de compte

module.exports = router;
