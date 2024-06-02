import {Sequelize} from "sequelize";
require('dotenv').config();
require('dotenv').config({ path: '.env.local' });

if (!process.env.POSTGRES_DB
    || !process.env.POSTGRES_USER
    || !process.env.POSTGRES_PASSWORD) {
    throw new Error('Postgres environment variables are not defined');
}

const sequelize = new Sequelize(
    process.env.POSTGRES_DB,
    process.env.POSTGRES_USER,
    process.env.POSTGRES_PASSWORD, {
        host: 'postgres',
        dialect: 'postgres',
    }
);

const testDbConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

export {sequelize, testDbConnection};