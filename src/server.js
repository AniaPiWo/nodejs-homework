import express from "express";
import logger from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import chalk from "chalk";
import app from "./app.js";
dotenv.config();

const PORT = 3000;

const server = express();

// middlewares
server.use(logger("dev"));
server.use(cors());
server.use(express.json());

server.use(app);

server.listen(PORT, async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: "db-contacts",
    });
    console.log(
      chalk.magenta(
        `Database connection successful, server running on port: ${PORT}`
      )
    );
  } catch (error) {
    console.log(chalk.red("MongoDB connection failed: ", error));
    process.exit(1);
  }
});
