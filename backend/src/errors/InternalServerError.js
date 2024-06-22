const AppError = require('./AppError');

class InternalServerError extends AppError {
    constructor(message) {
        super(message || 'Internal Server Error', 500);
    }
}

module.exports = InternalServerError;