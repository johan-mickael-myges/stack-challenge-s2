// a node script to drop the mongo database

const mongoose = require('mongoose');
const config = require('../../config/config');

const dropDatabase = async () => {
    try {
        await mongoose.connect(config.mongoURI, {});

        await mongoose.connection.db.dropDatabase();
    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.connection.close();
    }
}

dropDatabase();