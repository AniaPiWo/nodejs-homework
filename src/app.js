import express from "express";
import contactsRouter from "./routes/contactRoutes.js";

const app = express();

// Define routing paths
app.use("/", contactsRouter);
// Error handling for not found paths
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

// Application error handling
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

export default app;
