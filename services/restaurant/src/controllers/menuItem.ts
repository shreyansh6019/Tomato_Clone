import axios from "axios";
import getBuffer from "../config/dataUri.js";
import { AuthenticatedRequest } from "../middlewares/isAuth.js";
import TryCatch from "../middlewares/tryCatch.js";
import MenuItem from "../models/MenuItem.js";
import { Response } from "express";
import Restaurant from "../models/restaurant.js";

export const addMenuItem = TryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const { name, price, description } = req.body;

    if(!name || !price || !description) {
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

    const item = await MenuItem.create({
      name,
      price,
      description,
      image: uploadResponse.url,
      restaurantID: restaurant._id,
    });

    res.status(201).json({
        message: "Menu item created successfully",
        item,
    });
  },
);


export const getAllMenuItems = TryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Missing id" });
    }

    const menuItems = await MenuItem.find({ restaurantID: id });
    if (!menuItems) {
      return res.status(404).json({ message: "Menu items not found" });
    }
    res.status(200).json({
      message: "Menu items fetched successfully",
      menuItems,
    });
  },
);

export const getMenuItemById = TryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const { id } = req.params;
    const menuItem = await MenuItem.findOne({ restaurantID: restaurant._id, id });
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.status(200).json({
      message: "Menu item fetched successfully",
      menuItem,
    });
  },
);

export const deleteMenuItem = TryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { itemId } = req.params;
    const menuItem = await MenuItem.findById(itemId);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    const restaurant = await Restaurant.findOne({ _id: menuItem.restaurantID, ownerId: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const menuItemDeleted = await menuItem.deleteOne();

    if (!menuItemDeleted) {
      return res.status(404).json({ message: "Menu item not found" });
    }    
    res.status(200).json({
      message: "Menu item deleted successfully",
      menuItemDeleted,
    });
  },
);

export const toggleMenuItemAvailability = TryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { itemId } = req.params;
    const menuItem = await MenuItem.findById(itemId);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    const restaurant = await Restaurant.findOne({ _id: menuItem.restaurantID, ownerId: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const menuItemUpdated = await menuItem.updateOne({ isAvailable: !menuItem.isAvailable });

    if (!menuItemUpdated) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.status(200).json({
      message: `Item marked as ${menuItem.isAvailable ? "unavailable" : "available"}`,
      menuItemUpdated,
    });
  },
);

export const updateMenuItem = TryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { itemId } = req.params;
    const menuItem = await MenuItem.findById(itemId);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    const { name, price, description } = req.body;

    if(!name || !price || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const menuItemUpdated = await menuItem.updateOne(
      {
        name,
        price,
        description,
      },
      { new: true },
    );      

    if (!menuItemUpdated) {
        return res.status(404).json({ message: "Menu item not found" });
    }
    res.status(200).json({
      message: "Menu item updated successfully",
      menuItemUpdated,
    });
  },
);    