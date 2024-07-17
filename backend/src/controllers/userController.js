// controllers/userController.js

// Import des modules nécessaires
const { validationResult } = require('express-validator');
const userService = require('~services/userService'); // Assurez-vous d'importer votre service utilisateur correctement
const { env } = require('~config/config'); // Assurez-vous d'importer votre configuration correctement

// Fonction pour récupérer le profil utilisateur
const getUserProfile = async (req, res, next) => {
    // Récupération de l'ID utilisateur à partir de req.user (déjà attaché par le middleware d'authentification)
    const userId = req.user.id;

    try {
        // Utilisation du service utilisateur pour récupérer le profil de l'utilisateur
        const userProfile = await userService.getUserProfile(userId);

        // Renvoi des informations de profil de l'utilisateur
        res.json(userProfile);
    } catch (error) {
        next(error); // Gestion des erreurs
    }
};

// Exportation de la fonction getUserProfile
module.exports = {
    getUserProfile,
};