const bcrypt = require('bcrypt');
const crypto = require('crypto');
const config = require('~config/config');
const {ROLE_USER } = require('~constants/roles');
const { User, PasswordResetToken } = require('~models');
const { Role } = require('~models');
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('~errors/UnauthorizedError');
const BadRequestError = require('~errors/BadRequestError');
const eventEmitter = require('~services/eventEmitter');

exports.deleteUser = async (userId, password) => {
    const existingUser = await User.findByPk(userId);
    
    if (!existingUser) {
        throw new BadRequestError('L\'utilisateur n\'existe pas');
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    
    if (!isPasswordValid) {
        throw new UnauthorizedError('Mot de passe invalide');
    }

    existingUser.email = `anonyme${existingUser.id}@layaline.com`;
    existingUser.username = `Anonyme${existingUser.id}`;
    existingUser.firstname = 'Anonyme';
    existingUser.lastname = 'Utilisateur';
    const newPassword = generatePassword(12); 

    await existingUser.save();

    return existingUser;
};

exports.changePassword = async (userId, currentPassword, newPassword, confirmNewPassword ) => {
    const existingUser = await User.findByPk(userId);
    
    if (!existingUser) {
      throw new BadRequestError('L\'utilisateur n\'existe pas');
    }
  
    const isPasswordValid = await bcrypt.compare(currentPassword, existingUser.password);
    
    if (!isPasswordValid) {
      throw new BadRequestError('Mot de passe actuel invalide');
    }

    if (newPassword !== confirmNewPassword) {
      throw new BadRequestError('Le nouveau mot de passe et la confirmation du nouveau mot de passe ne correspondent pas');
    }

    existingUser.password = newPassword;
  
    await existingUser.save();
  
    return existingUser;
  };

exports.resetPassword = async (token, newPassword) => {
    const resetToken = await PasswordResetToken.findOne({ where: { token } });
    if (!resetToken || resetToken.expiresAt < new Date()) {
        throw new Error('Token invalide ou expiré.');
    }
    const user = await User.findByPk(resetToken.userId);
    user.password = newPassword;
    await user.save();
    await resetToken.destroy();
};

exports.validateResetToken = async (token) => {

      const resetToken = await PasswordResetToken.findOne({ where: { token } });
      if (!resetToken || resetToken.expiresAt < new Date()) {
        throw new Error('Token invalide ou expiré' );
      }
      return true;
};

exports.sendEmailResetPassword = async (email) => {
    const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error('Aucun utilisateur trouvé avec cette adresse e-mail');
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 3600000);

      await PasswordResetToken.create({
          userId: user.id,
          token: resetToken,
          expiresAt,
      });

      eventEmitter.emit('userResetPassword', { user, resetToken });
};

function generatePassword(length = 12) {
    if (length < 8) {
        throw new Error('La longueur du mot de passe doit être d\'au moins 8 caractères.');
    }

    const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numberChars = '0123456789';
    const specialChars = '!@#$%^&*()-_=+[]{}|;:,.<>?';

    const allChars = lowerCaseChars + upperCaseChars + numberChars + specialChars;
    let password = '';
    
    password += upperCaseChars.charAt(Math.floor(Math.random() * upperCaseChars.length));
    password += numberChars.charAt(Math.floor(Math.random() * numberChars.length));
    password += specialChars.charAt(Math.floor(Math.random() * specialChars.length));
    password += lowerCaseChars.charAt(Math.floor(Math.random() * lowerCaseChars.length));
    
    for (let i = password.length; i < length; i++) {
        password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }
    
    return password.split('').sort(() => Math.random() - 0.5).join('');
}

exports.registerUser = async (userData) => {
    const existingUser = await User.findOne({ where: { email: userData.email } });
    if (existingUser) {
        throw new BadRequestError('L\'utilisateur existe déjà');
    }

    const user = await User.create(userData);

    const role = await Role.findOne({ where: { id: ROLE_USER } });
    await user.addRole(role);
    eventEmitter.emit('userRegisterMailer', user);

    return user;
};

exports.loginUser = async (email, password) => {
    const user = await User.findOne({
        where: { email },
        include: {
            model: Role,
            attributes: ['name'],
            through: { attributes: [] }
        }
    });

    if (!user) {
        throw new UnauthorizedError('Mot de passe ou email invalide');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new UnauthorizedError('Mot de passe ou email invalide');
    }

    const roles = user.Roles.map(role => role.name);

    const token = jwt.sign(
            { userId: user.id, roles },
            config.jwtSecret,
            { expiresIn: config.jwtExpiresIn }
    );

    return { user, token };
};