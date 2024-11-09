const mongoose = require('mongoose');
const config = require('../config');

const dbUrl = config.dbUrlMongoDB;

const connectDB = async () => {
  try {
    await mongoose.connect(dbUrl);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

connectDB();

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

module.exports = mongoose;
