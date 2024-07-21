require('module-alias/register');
require('dotenv').config();
const env = process.env.NODE_ENV || 'development';
if (env === 'development') {
    require('dotenv').config({ path: '.env.local' });
} else if (env === 'test') {
    require('dotenv').config({ path: '.env.test' });
} else if (env === 'production') {
    require('dotenv').config({ path: '.env.prod' });
}

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');
const crypto = require('crypto');
const User = require('./models/user'); // Assurez-vous que ce chemin est correct
const routes = require('./routes');
const errorHandler = require('~middlewares/errorHandler');
const { frontendUrl } = require('~config/config');

const productListener = require('~listeners/productListeners');
productListener;

const app = express();

// Configurez le transporteur d'email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Fonction pour envoyer un email de confirmation
const sendConfirmationEmail = async (userEmail, confirmationLink) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
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


// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: frontendUrl,
    credentials: true,
}));
app.use(cookieParser());

// Routes
app.use('/', routes);


app.post('/users/anonymize', async (req, res) => {
  const { userId, userEmail } = req.body;

  try {
    console.log('Demande d\'anonymisation pour l\'utilisateur ID:', userId, 'Email:', userEmail);

    const token = crypto.randomBytes(20).toString('hex');
    const confirmationLink = `${frontendUrl}/users/confirm-anonymize/${token}`;

    // Sauvegardez le token et le userId associé dans la base de données
    const [updated] = await User.update(
      { anonymizationToken: token, anonymizationTokenExpires: Date.now() + 3600000 },
      { where: { id: userId } }
    );

    if (updated === 0) {
      console.log('Utilisateur non trouvé ou mise à jour échouée');
      return res.status(404).send('Utilisateur non trouvé ou mise à jour échouée');
    }

    await sendConfirmationEmail(userEmail, confirmationLink);
    res.status(200).send('Une demande de confirmation a été envoyée à votre adresse email.');
  } catch (error) {
    console.error('Erreur lors de la demande d\'anonymisation:', error);
    res.status(500).send('Erreur lors de la demande d\'anonymisation.');
  }
});

app.get('/users/confirm-delete/:token', async (req, res) => {
  const { token } = req.params;
  try {
    console.log('Confirmation de suppression pour le token:', token);

    const user = await User.findOne({ where: { deletionToken: token, deletionTokenExpires: { [Op.gt]: Date.now() } } });

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
});

app.get('/users/confirm-anonymize/:token', async (req, res) => {
  const { token } = req.params;
  try {
    console.log('Confirmation d\'anonymisation pour le token:', token);

    const user = await User.findOne({ where: { anonymizationToken: token, anonymizationTokenExpires: { [Op.gt]: Date.now() } } });

    if (!user) {
      console.log('Token de confirmation invalide ou expiré');
      return res.status(400).send('Le token de confirmation est invalide ou a expiré.');
    }

    await User.update({ lastname: 'Anonyme', firstname: 'Anonyme', email: 'anonyme@example.com', number: null }, { where: { id: user.id } });
    res.status(200).send('Votre compte a été anonymisé avec succès.');
  } catch (error) {
    console.error('Erreur lors de l\'anonymisation du compte:', error);
    res.status(500).send('Erreur lors de l\'anonymisation du compte.');
  }
});

// Gestion des erreurs
app.use(errorHandler);

module.exports = app;
