const eventEmitter = require('~services/eventEmitter');
const sendMail = require('~services/mailerService');
const config = require('~config/config');

eventEmitter.on('userRegisterMailer', async (user) => {
    try {
        await sendMail(user.email, 'Bienvenue', 'welcome-user', {
            user: user,
            loginUrl: `${config.frontendUrl}/login`,
        });
    } catch (error) {
        console.error('Error sending welcome email', error);
    }
});

eventEmitter.on('userResetPassword', async (data) => {
    try {
        const {user, resetToken} = data;
        await sendMail(user.email, 'Réinitialisation du mot de passe', 'reset-password', {
            user: user,
            resetPasswordUrl: `${config.frontendUrl}/resetPassword?token=${resetToken}`,
        });
    } catch (error) {
        console.error('Error sending Reset password email', error);
        throw new Error('Erreur lors de l\'envoi de l\'email de réinitialisation');
    }
});

module.exports = eventEmitter;
