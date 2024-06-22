const NODE_ENV = process.env.NODE_ENV || 'development';

const errorHandler = (err, req, res, next) => {
    if (err.isOperational) {
        res.sendStatus(err.statusCode);
    } else {
        if (NODE_ENV === 'development') {
            console.error(err);
        }
        res.sendStatus(500);
    }
};

module.exports = errorHandler;