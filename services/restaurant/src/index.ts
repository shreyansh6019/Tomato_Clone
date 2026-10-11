import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectToDatabase from "./config/db.js";
import restaurantRoutes from "./routes/restaurant.js";
import menuItemRoutes from "./routes/menuItem.js";

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.send("Hello from Auth Service!");
});

app.use("/api/v1/restaurant", restaurantRoutes);
app.use("/api/v1/item", menuItemRoutes);

app.listen(PORT, () => {
  console.log(`Restaurant service is running on port ${PORT}`);
  connectToDatabase();
});

export default app;
