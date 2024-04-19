import express from "express";
import logger from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import chalk from "chalk";
import app from "./app.js";
import jwtStrategy from "./config/jwt.js";

dotenv.config();

const PORT = 3000;
const DB = process.env.DB_URL;

const server = express();

// middlewares
server.use(logger("dev"));
server.use(cors());
server.use(express.json());

server.use(app);

jwtStrategy();

server.listen(PORT, async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(DB);
    console.log(chalk.magenta(`MongoDB connected, port: ${PORT}`));
  } catch (error) {
    console.log(chalk.red("MongoDB connection failed: ", error));
    process.exit(1);
  }
});
