import TryCatch from "../middlewares/tryCatch.js";
import { Request, Response } from "express";
import Restaurant from "../models/restaurant.js";
import { AuthenticatedRequest } from "../middlewares/isAuth.js";
import getBuffer from "../config/dataUri.js";
import axios from "axios";
import jwt from "jsonwebtoken";

export const getAllRestaurants = TryCatch(
  async (req: Request, res: Response) => {
    const restaurants = await Restaurant.find();
    if (!restaurants) {
      return res.status(404).json({ message: "Restaurants not found" });
    }
    res.status(200).json({
      message: "Restaurants fetched successfully",
      restaurants,
    });
  },
);

export const getRestaurantById = TryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.status(200).json({
      message: "Restaurant fetched successfully",
      restaurant,
    });
  },
);

export const addRestaurant = TryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const existingRestaurant = await Restaurant.findOne({ ownerId: user._id });
    if (existingRestaurant) {
      return res.status(400).json({ message: "Restaurant already exists" });
    }
    const {
      name,
      description,
      latitude,
      longitude,
      formattedAddress,
      phone,
      isVerified,
      isOpen,
    } = req.body;
    if (!name || !latitude || !longitude) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "Missing file" });
    }

    const fileBuffer = getBuffer(file);
    if (!fileBuffer?.content) {
      return res.status(400).json({ message: "Invalid file" });
    }

    const { data: uploadResponse } = await axios.post(
      `${process.env.UPLOAD_URL}/api/v1/utils/upload`,
      {
        buffer: fileBuffer.content,
      },
    );

    const restaurant = await Restaurant.create({
      name,
      description,
      image: uploadResponse.url,
      ownerId: user._id,
      phone,
      isVerified,
      autoLocation: {
        type: "Point",
        coordinates: [longitude, latitude],
        formattedAddress,
      },
      isOpen,
    });

    res.status(201).json({
      message: "Restaurant created successfully",
      restaurant,
    });
  },
);

export const fetchMyRestaurant = TryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const restaurant = await Restaurant.findOne({ ownerId: user._id });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    if (!user.restaurantId) {
      const token = jwt.sign(
        {
          user: {
            ...user,
            restaurantId: restaurant._id,
          },
        },
        process.env.JWT_SECRET as string,
        { expiresIn: "15d" },
      );
      return res.status(200).json({
        message: "Restaurant fetched successfully",
        restaurant,
        token,
      });
    }
    res.status(200).json({
      message: "Restaurants fetched successfully",
      restaurant,

    });
  },
);

export const updateRestaurantStatus = TryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { status } = req.body;
    console.log(status, typeof status);
    if(typeof status !== "boolean") {
      return res.status(400).json({ message: "Status must be boolean" });
    }

    const restaurant = await Restaurant.findOneAndUpdate({ ownerId: req.user._id }, { isOpen: status }, { new: true });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.status(200).json({
      message: "Restaurant status updated successfully",
      restaurant,
    });
  },
);

export const editRestaurant = TryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const {
      name,
      description,
    } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const restaurant = await Restaurant.findOneAndUpdate(
      { ownerId: req.user._id },
      {
        name,
        description,
      },
      { new: true },
    );

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.status(200).json({
      message: "Restaurant updated successfully",
      restaurant,
    });
  },
);