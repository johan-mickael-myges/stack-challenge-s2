const configService = require('~services/configService');

exports.getPayPalClient = async (req, res, next) => {
    try {
        const config = await configService.getConfig('paypal.client');
        res.status(200).send(config.value);
    } catch (error) {
        next(error);
    }
};