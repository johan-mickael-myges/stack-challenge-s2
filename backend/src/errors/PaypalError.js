const AppError = require('./AppError');

class PaypalError extends AppError {
    constructor(statusCode, message) {
        super(message || 'Bad Request', statusCode);
    }
}

module.exports = PaypalError;