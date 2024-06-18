const jwt = require('jsonwebtoken');
const { User } = require('../../models'); 
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

const register = async (req, res) => {
    const { username, firstname, lastname, email, number, password } = req.body;

    try {
        
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email déjà utilisé' });
        }
    
        const user = await User.create({ username, firstname, lastname, email, number, password });

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports = { register };
