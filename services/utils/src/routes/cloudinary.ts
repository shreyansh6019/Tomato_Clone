import express, { Request, Response } from "express";
import cloudinary from "cloudinary";

const router = express.Router();

router.post("/upload", async (req: Request, res: Response) => {
  try {
    const { buffer } = req.body;
    const cloud = await cloudinary.v2.uploader.upload(buffer);
    res.json({
      url: cloud.secure_url,
    });
  } catch (error) {
    res.status(500).send({
      message: error instanceof Error ? error.message : String(error),
    });
  }
});

export default router;
