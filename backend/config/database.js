import mongoose from "mongoose";
import logger from "./logger.js";

export const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    logger.error("MONGO_URI is undefined. Check .env file");
    process.exit(1);
  }

  mongoose.connection.on("connected", () => {
    const { host, port, name } = mongoose.connection;
    logger.info(`MongoDB Connected To: ${host || 'N/A'}:${port || 'N/A'} - DB Name: ${name || 'N/A'}`);
  });

  mongoose.connection.on("error", (err) => {
    logger.error(`Mongoose connection error: ${err}`);
  });

  try {
    await mongoose.connect(MONGO_URI);
  } catch (error) {
    logger.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};
