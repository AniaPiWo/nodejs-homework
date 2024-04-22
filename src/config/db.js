import mongoose from "mongoose";
import chalk from "chalk";

export async function connectDB() {
  const DB = process.env.DB_URI;
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(DB);
    console.log(chalk.magenta("MongoDB connected successfully"));
  } catch (error) {
    console.error(chalk.red("MongoDB connection failed: ", error));
    process.exit(1);
  }
}

export async function disconnectDB() {
  try {
    console.log("Disconnecting from MongoDB...");
    await mongoose.disconnect();
    console.log(chalk.magenta("MongoDB disconnected successfully"));
  } catch (error) {
    console.error(chalk.red("MongoDB disconnection failed: ", error));
    process.exit(1);
  }
}
