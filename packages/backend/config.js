const mongoose = require('mongoose');
require('dotenv').config();
const PORT = 8000;

const mongooseConnect = () => {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING ?? 'mongodb://127.0.0.1:27017/test');
}

module.exports = {
    PORT,
    mongooseConnect
};