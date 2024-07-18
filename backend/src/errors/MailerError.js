const AppError = require('./AppError');

class MailerError extends AppError {
    constructor(message) {
        super(message || 'Error sending mail', 500);
    }
}

module.exports = MailerError;