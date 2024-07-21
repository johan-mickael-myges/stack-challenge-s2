// controllers/userController.js
require('dotenv').config();

// Import des modules nécessaires
// controllers/userController.js

// controllers/userController.js

const { validationResult } = require('express-validator');
const userService = require('~services/userService');
const { env } = require('~config/config');
const { User, Order } = require('../models');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { Op } = require('sequelize');
const { cp } = require('fs');


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendConfirmationEmail = async (userEmail, confirmationLink) => {


  const mailOptions = {
    from: 'sarah@gmail.com',
    to: userEmail,
    subject: 'Confirmation de la suppression ou anonymisation de compte',
    text: `Veuillez confirmer votre demande en cliquant sur le lien suivant: ${confirmationLink}`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email de confirmation envoyé à', userEmail);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de confirmation:', error);
    throw error;
  }
};


const deleteUser = async (req, res) => {

  console.log("coucou");
  const { userId, userEmail } = req.body;
  console.log('Demande de suppression pour l\'utilisateur ID:', userId);


  try {

    console.log('Début de la transaction de suppression d\'utilisateur');

    const token = crypto.randomBytes(20).toString('hex');

    const confirmationLink = `http://localhost:3000/users/confirm-delete/${token}`;


    const [updated] = await User.update(
      { deletionToken: token, deletionTokenExpires: Date.now() + 3600000 },
      { where: { id: userId } }
    );


    console.log('Mise à jour de l\'utilisateur effectuée, nombre de lignes mises à jour:', updated);

    if (updated === 0) {

      console.log('Utilisateur non trouvé ou mise à jour échouée');
      throw new Error('User not found or update failed');
    }

    await sendConfirmationEmail(userEmail, confirmationLink);

    res.status(200).send('Une demande de confirmation a été envoyée à votre adresse email.');
  } catch (error) {
    console.error('Erreur lors de la demande de suppression :', error);
    res.status(500).send('Erreur lors de la demande de suppression email.' );
  }
};

const confirmDeleteUser = async (req, res) => {
  const { token } = req.params;
  console.log('Confirmation de suppression pour le token:', token);

  try {
    const user = await User.findOne({
      where: { deletionToken: token, deletionTokenExpires: { [Op.gt]: Date.now() } },
    });
    if (!user) {
      console.log('Token de confirmation invalide ou expiré');
      return res.status(400).send('Le token de confirmation est invalide ou a expiré.');
    }

    await User.destroy({ where: { id: user.id } });
    res.status(200).send('Votre compte a été supprimé avec succès.');
  } catch (error) {
    console.error('Erreur lors de la suppression du compte:', error);
    res.status(500).send('Erreur lors de la suppression du compte.');
  }
};

module.exports = {
  deleteUser,
  confirmDeleteUser,
};

// Récupérer le profil utilisateur
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Récupérer l'ID de l'utilisateur depuis la session ou le token
    const user = await User.findById(userId); // Récupérer les informations de l'utilisateur depuis la base de données
    if (user) {
      res.json({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        number: user.number,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


// Récupérer les commandes de l'utilisateur
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id; // Assurez-vous que l'utilisateur est authentifié et que l'ID est disponible
    const orders = await Order.find({ userId }); // Exemple avec Mongoose
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Demande d'anonymisation de compte
const anonymizeUser = async (req, res) => {
  const { userId, userEmail } = req.body;

  try {
    const token = crypto.randomBytes(20).toString('hex');
    const confirmationLink = `http://localhost:3000/users/confirm-anonymize/${token}`;

    await User.update(
      { anonymizationToken: token, anonymizationTokenExpires: Date.now() + 3600000 },
      { where: { id: userId } }
    );

    await sendConfirmationEmail(userEmail, confirmationLink);
    res.status(200).send('Une demande de confirmation a été envoyée à votre adresse email.');
  } catch (error) {
    res.status(500).send('Erreur lors de l\'envoi du mail de confirmation.');
  }
};

// Confirmer l'anonymisation de compte
const confirmAnonymizeUser = async (req, res) => {
  const { token } = req.params;
  try {
    const user = await User.findOne({
      where: { anonymizationToken: token, anonymizationTokenExpires: { [Op.gt]: Date.now() } },
    });
    if (!user) {
      return res.status(400).send('Le token de confirmation est invalide ou a expiré.');
    }

    await User.update(
      { lastname: 'Anonyme', firstname: 'Anonyme', email: 'anonyme@example.com', number: null },
      { where: { id: user.id } }
    );
    res.status(200).send('Votre compte a été anonymisé avec succès.');
  } catch (error) {
    res.status(500).send('Erreur lors de l\'anonymisation du compte.');
  }
};

module.exports = {
  getUserProfile,
  getUserOrders,
  deleteUser,
  confirmDeleteUser,
  anonymizeUser,
  confirmAnonymizeUser,
};
