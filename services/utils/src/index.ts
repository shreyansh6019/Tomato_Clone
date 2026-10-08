import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cloudinary from "cloudinary";

import uploadRoutes from "./routes/cloudinary.js";

const { CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET } = process.env;

if (!CLOUD_NAME || !CLOUD_API_KEY || !CLOUD_API_SECRET) {
  throw new Error("Missing Cloudinary credentials");
}

cloudinary.v2.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUD_API_KEY,
  api_secret: CLOUD_API_SECRET,
});

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

const PORT = process.env.PORT || 3002;

app.get("/", (req, res) => {
  res.send("Hello from Utils Service!");
});

app.use("/api/v1/utils", uploadRoutes);

app.listen(PORT, () => {
  console.log(`Utils service is running on port ${PORT}`);
});

export default app;
