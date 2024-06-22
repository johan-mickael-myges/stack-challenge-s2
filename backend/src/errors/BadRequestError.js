const AppError = require('./AppError');

class BadRequestError extends AppError {
    constructor(message) {
        super(message || 'Bad Request', 400);
    }
}

module.exports = BadRequestError;