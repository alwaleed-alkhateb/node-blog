const mongoose = require('mongoose');
require('dotenv').config();

const connectDatabase = async () => {
    try {
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);

    }
};

module.exports = connectDatabase;