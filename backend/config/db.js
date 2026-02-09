const mongoose = require("mongoose");

// connect to mongo - pretty straightforward
// using the connection string from env vars
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection failed: ${error.message}`);
    // if we cant connect to the db theres no point running the server honestly
    process.exit(1);
  }
};

module.exports = connectDB;
