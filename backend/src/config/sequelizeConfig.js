const config = require('./config');

module.exports = {
    development: {
        username: config.postgres.username,
        password: config.postgres.password,
        database: config.postgres.database,
        host: config.postgres.host,
        dialect: config.postgres.dialect,
    },
    production: {
        username: config.postgres.username,
        password: config.postgres.password,
        database: config.postgres.database,
        host: config.postgres.host,
        dialect: config.postgres.dialect,
    },
};