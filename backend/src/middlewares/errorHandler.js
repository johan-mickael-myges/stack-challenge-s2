const errorHandler = (err, req, res, next) => {
    if (err.isOperational) {
        const code = err.statusCode || 500;
        res.status(code).send(err.message);
    } else {
        console.error(err);
        res.status(500).send(err.message);
    }
};

module.exports = errorHandler;