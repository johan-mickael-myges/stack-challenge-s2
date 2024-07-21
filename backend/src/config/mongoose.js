const mongoose = require('mongoose');
const config = require('../config/config');

const connectDB = async () => {
    try {
        await mongoose.connect(config.mongoURI, {});
    } catch (err) {
        console.error(err.message);
    }
};

module.exports = connectDB;