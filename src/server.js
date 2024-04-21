import express from "express";
import logger from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import chalk from "chalk";
import app from "./app.js";
import jwtStrategy from "./config/jwt.js";
import { setupFolder, tempDir, storeImageDir } from "./middleware/multer.js";
import { connectDB } from "./db.js";

dotenv.config();

const PORT = 8000;

const server = express();

// middlewares
server.use(logger("dev"));
server.use(cors());
server.use(express.json());
server.use(express.static("public"));

server.use(app);

jwtStrategy();

server.listen(PORT, async () => {
  try {
    await setupFolder(tempDir);
    await setupFolder(storeImageDir);
    await connectDB();
    console.log(chalk.magenta(`Server running on port: ${PORT}`));
  } catch (error) {
    console.error(chalk.red("Server initialization failed: ", error));
    process.exit(1);
  }
});
