import express from "express";
import logger from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import chalk from "chalk";
import app from "./src/app.js";
import jwtStrategy from "./src/config/jwt.js";
import {
  setupFolder,
  tempDir,
  storeImageDir,
} from "./src/middleware/multer.js";
import { connectDB } from "./src/config/db.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

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
