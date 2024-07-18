const { User, Order } = require('../models');

exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Supposons que l'ID de l'utilisateur est attaché à la requête après l'authentification
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        return res.status(200).json(user.toJSON());
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur lors de la récupération du profil utilisateur' });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id; // Supposons que l'ID de l'utilisateur est attaché à la requête après l'authentification
        const orders = await Order.findAll({ where: { userId } });
        return res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur lors de la récupération des commandes de l\'utilisateur' });
    }
};
