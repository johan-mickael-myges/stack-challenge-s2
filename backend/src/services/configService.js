const { Config } = require('~models');
const NotFoundError = require('~errors/NotFoundError');

const getConfig = async (key) => {
    if (!key) {
        return null;
    }

    const config = await Config.findOne({where: {key}});

    if (!config) {
        throw new NotFoundError('Config not found');
    }

    return config;
}

module.exports = {
    getConfig,
}