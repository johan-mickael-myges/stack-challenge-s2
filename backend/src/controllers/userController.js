// controllers/userController.js

// Import des modules nécessaires
const { validationResult } = require('express-validator');
const userService = require('~services/userService'); // Assurez-vous d'importer votre service utilisateur correctement
const { env } = require('~config/config'); // Assurez-vous d'importer votre configuration correctement
const { User, Order } = require('../models');

const getUserProfile = async (req, res) => {
    try {
      const userId = req.user.id; // Récupérer l'ID de l'utilisateur depuis la session ou le token
      const user = await User.findById(userId); // Récupérer les informations de l'utilisateur depuis la base de données
      if (user) {
        res.json({
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          number: user.number
        });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };

const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({ where: { userId: req.user.id } });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getUserProfile, getUserOrders };
