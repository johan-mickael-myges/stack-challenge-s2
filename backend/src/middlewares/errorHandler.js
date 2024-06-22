const errorHandler = (err, req, res, next) => {
    if (err.isOperational) {
        res.sendStatus(err.statusCode);
    } else {
        console.error('ERROR 💥', err);
        res.sendStatus(500);
    }
};

module.exports = errorHandler;