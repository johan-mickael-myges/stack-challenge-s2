const mongoose = require('mongoose');
const config = require('../config/config');

console.log(config.mongoURI);

const connectDB = async () => {
    try {
        await mongoose.connect(config.mongoURI, {});
        console.log('MongoDB connected...');
    } catch (err) {
        console.error(err.message);
    }
};

module.exports = connectDB;