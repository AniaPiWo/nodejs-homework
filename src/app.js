import express from "express";
import api from "./routes/index.js";

const app = express();

app.use("/", api);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

export default app;
