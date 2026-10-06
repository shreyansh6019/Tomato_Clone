import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectToDatabase from "./config/db.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello from Auth Service!");
});

app.use("/api/v1/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Auth service is running on port ${PORT}`);
  connectToDatabase();
});

export default app;
