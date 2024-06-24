const config = require('~config/config');

const errorHandler = (err, req, res, next) => {
    if (err.isOperational) {
        res.sendStatus(err.statusCode);
    } else {
        if (config.env === 'development') {
            console.error(err);
        }
        res.sendStatus(500);
    }
};

module.exports = errorHandler;