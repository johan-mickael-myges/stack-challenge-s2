import mongoose from 'mongoose';
require('dotenv').config();

const URI = process.env.MONGO_URI;

if (!URI) {
    throw new Error('Mongo URI is not defined');
}

console.log(URI);

export const connect = async (): Promise<void> => {
    try {
        await mongoose.connect(URI, {});
        console.log('Connected to database');
    } catch (e) {
        console.error(e);
    }
}

export const disconnect = async (): Promise<void> => {
    try {
        await mongoose.disconnect();
        console.log('Disconnected from database');
    } catch (e) {
        console.error(e);
    }
}

export default mongoose;